/**
 * =============================================================================
 * BIBEK BANDHU NAYEK — BOTANICAL DEVELOPER JOURNAL & PORTFOLIO
 * Architecture: Pure Vanilla ES6+ Engine
 * Features:
 *   1. 3D Natural Showroom Gallery with Mouse-Move Tilt
 *   2. Lightbox Certificate Inspector
 *   3. Strict Admin-Only Security Authentication (Default PIN: 2026)
 *   4. Dynamic Certificate CRUD (Add Later Achievements from Frontend)
 *   5. Pebble Profile Picture Manager (Upload/URL)
 *   6. Journey Narrative Live Editor
 *   7. Category Filtering & Real-Time Count Badges
 *   8. Backup, JSON Export/Import & Factory Reset
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------------------------------------------------------
  // 01. DEFAULT CERTIFICATES & DATA REPOSITORY
  // ---------------------------------------------------------------------------
  const DEFAULT_CERTIFICATES = [
    {
      id: 'cert-ibm-ai',
      title: 'Artificial Intelligence Foundations & Machine Learning',
      issuer: 'IBM SkillsBuild',
      date: 'September 2024',
      category: 'ai',
      image: 'assets/ibm-ai-basics-certificate.png',
      badge: 'Verified Credential',
      description: 'Comprehensive mastery of machine learning workflows, classification models, neural fundamentals, and AI ethics.'
    },
    {
      id: 'cert-ibm-llm',
      title: 'Large Language Models & Generative AI Systems',
      issuer: 'IBM SkillsBuild',
      date: 'October 2024',
      category: 'ai',
      image: 'assets/ibm-llm-basics-certificate.png',
      badge: 'Advanced LLM',
      description: 'Architecting generative AI pipelines, transformer attention mechanics, prompt tuning, and grounding techniques.'
    },
    {
      id: 'cert-ibm-prompt',
      title: 'Prompt Engineering & Autonomous Agent Architectures',
      issuer: 'IBM SkillsBuild',
      date: 'October 2024',
      category: 'ai',
      image: 'assets/ibm-prompting-certificate.png',
      badge: 'Agent Engineering',
      description: 'Structured prompt design, chain-of-thought orchestration, few-shot conditioning, and LLM tool utilization.'
    },
    {
      id: 'cert-isro-space',
      title: 'National Space Day Certificate of Excellence',
      issuer: 'Indian Space Research Organisation (ISRO)',
      date: 'August 2024',
      category: 'national',
      image: 'assets/isro-space-day-certificate.png',
      badge: 'National Honor',
      description: 'Awarded by ISRO for high distinction in nationwide space science, astrophysics, and orbital calculation drills.'
    },
    {
      id: 'cert-cirqula-nspc',
      title: 'National Student Projects Innovation Award (Cirqula)',
      issuer: 'National Student Projects Competition (NSPC)',
      date: '2024',
      category: 'national',
      image: 'assets/cirqula-certificate.jpeg',
      badge: 'National Innovation',
      description: 'Recognized for algorithmic software design and practical computer science innovation at the national level.'
    },
    {
      id: 'cert-gi-tag',
      title: 'National Intellectual Heritage & GI Tag Distinction',
      issuer: 'Ministry of Commerce & Industry, Govt. of India',
      date: '2024',
      category: 'national',
      image: 'assets/gi-tag-quiz-certificate.png',
      badge: 'Government Award',
      description: 'National certification in regional intellectual property, cultural geography, and heritage preservation.'
    },
    {
      id: 'cert-first-commit',
      title: 'FIRST COMMIT Seminar Certificate of Participation',
      issuer: 'Department of Computer Science & Engineering, FIEM',
      date: 'August 2026',
      category: 'technical',
      image: 'assets/first-commit-certificate.png',
      badge: 'CSE Department Honor',
      description: 'Awarded for active participation in the "FIRST COMMIT" seminar organized by the Department of CSE at Future Institute of Engineering and Management (MoE Innovation Cell).'
    },
    {
      id: 'cert-coursera-canva',
      title: 'Use CANVA to Design Digital Course Collateral',
      issuer: 'COURSERA',
      date: 'October 2026',
      category: 'technical',
      image: 'assets/coursera-canva-certificate.png',
      badge: 'Coursera Certified',
      description: 'Happy to learn so many things of Art , Designing, create any type of Resume, CV, PPTs, etc. Project authorized by Coursera.'
    }
  ];

  const DELETED_CERTIFICATE_IDS = [
    'cert-secondary-2024',
    'cert-hs-2026',
    'cert-bonafide-fiem',
    'cert-nspc-merit',
    'cert-bridge-fiem'
  ];

  // Helper functions for storage
  const getCertificates = () => {
    try {
      const stored = localStorage.getItem('bbn_nature_certificates');
      if (stored) {
        let parsed = JSON.parse(stored);
        let updated = false;
        
        // Auto-purge explicitly deleted certificates from client storage
        const initialCount = parsed.length;
        parsed = parsed.filter(c => !DELETED_CERTIFICATE_IDS.includes(c.id));
        if (parsed.length !== initialCount) {
          updated = true;
        }

        // Auto-migrate: If user uploaded base64 Canva cert locally, replace with clean asset path
        parsed.forEach((c, idx) => {
          if (c.title && c.title.toLowerCase().includes('canva') && c.image && c.image.startsWith('data:')) {
            parsed[idx].image = 'assets/coursera-canva-certificate.png';
            updated = true;
          }
        });

        // Ensure all DEFAULT_CERTIFICATES are present
        const existingTitles = new Set(parsed.map(c => (c.title || '').trim().toLowerCase()));
        DEFAULT_CERTIFICATES.forEach(defCert => {
          if (!existingTitles.has((defCert.title || '').trim().toLowerCase())) {
            parsed.push(defCert);
            updated = true;
          }
        });

        if (updated) {
          saveCertificates(parsed);
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read certificates from localStorage:', e);
    }
    return DEFAULT_CERTIFICATES;
  };

  const saveCertificates = (certs) => {
    localStorage.setItem('bbn_nature_certificates', JSON.stringify(certs));
  };

  const getAdminPin = () => {
    return localStorage.getItem('bbn_nature_pin') || '2026';
  };

  const isAdminAuthenticated = () => {
    return sessionStorage.getItem('bbn_nature_session') === 'unlocked';
  };

  // ---------------------------------------------------------------------------
  // 02. TOAST NOTIFICATION UTILITY
  // ---------------------------------------------------------------------------
  const showToast = (message, icon = '🌿') => {
    const container = document.getElementById('nature-toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'nature-toast';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  };

  // ---------------------------------------------------------------------------
  // 03. 3D NATURAL GALLERY & BI-DIRECTIONAL INFINITE MARQUEE ENGINE
  // ---------------------------------------------------------------------------
  const galleryGrid = document.getElementById('cert-gallery-grid');
  const marqueeShowroom = document.getElementById('cert-marquee-showroom');
  const marqueeTrack1 = document.getElementById('cert-marquee-track-1');
  const marqueeTrack2 = document.getElementById('cert-marquee-track-2');
  const marqueeTogglePlay = document.getElementById('marquee-toggle-play');
  const marqueePlayIcon = document.getElementById('marquee-play-icon');
  const marqueePlayLabel = document.getElementById('marquee-play-label');
  const marqueeToggleDir = document.getElementById('marquee-toggle-dir');
  const marqueeToggleView = document.getElementById('marquee-toggle-view');
  const marqueeViewIcon = document.getElementById('marquee-view-icon');
  const marqueeViewLabel = document.getElementById('marquee-view-label');

  let currentFilter = 'all';
  let currentViewMode = 'marquee'; // 'marquee' or 'grid'
  let isMarqueePaused = false;
  let isDirectionReversed = false;

  const populateMarqueeTrack = (trackElement, certList) => {
    if (!trackElement) return;
    trackElement.innerHTML = '';
    if (!certList || certList.length === 0) return;

    // Minimum 8 items per track to comfortably span ultrawide viewports
    const repeatTimes = Math.max(2, Math.ceil(8 / certList.length));

    // Set A (original set)
    for (let r = 0; r < repeatTimes; r++) {
      certList.forEach(cert => {
        const card = createCertificateCardDOM(cert);
        trackElement.appendChild(card);
      });
    }

    // Set B (exact seamless loop clone set for continuous loop at -50% translateX)
    for (let r = 0; r < repeatTimes; r++) {
      certList.forEach(cert => {
        const card = createCertificateCardDOM(cert);
        trackElement.appendChild(card);
      });
    }
  };

  const renderCertificates = () => {
    const certs = getCertificates();
    const filtered = currentFilter === 'all' 
      ? certs 
      : certs.filter(c => c.category === currentFilter);

    // 1. Populate Bi-Directional Infinite Marquee Showroom
    if (marqueeShowroom && marqueeTrack1 && marqueeTrack2) {
      if (filtered.length === 0) {
        marqueeTrack1.innerHTML = `
          <div style="padding: 3rem 1rem; color: var(--text-muted); text-align: center; width: 100vw;">
            <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">🌱</span>
            <p class="font-serif" style="font-size: 1.25rem;">No certificates found in this category.</p>
          </div>
        `;
        marqueeTrack2.innerHTML = '';
      } else if (filtered.length === 1) {
        populateMarqueeTrack(marqueeTrack1, filtered);
        populateMarqueeTrack(marqueeTrack2, filtered);
      } else {
        // Distribute alternating items across Row 1 (Left) and Row 2 (Right)
        const row1Certs = filtered.filter((_, idx) => idx % 2 === 0);
        const row2Certs = filtered.filter((_, idx) => idx % 2 === 1);
        populateMarqueeTrack(marqueeTrack1, row1Certs.length > 0 ? row1Certs : filtered);
        populateMarqueeTrack(marqueeTrack2, row2Certs.length > 0 ? row2Certs : filtered);
      }
    }

    // 2. Populate Classic Exhibition Grid
    if (galleryGrid) {
      galleryGrid.innerHTML = '';
      if (filtered.length === 0) {
        galleryGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
            <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">🌱</span>
            <p class="font-serif" style="font-size: 1.25rem;">No certificates found in this category.</p>
          </div>
        `;
      } else {
        filtered.forEach((cert) => {
          const card = createCertificateCardDOM(cert);
          galleryGrid.appendChild(card);
        });
      }
    }

    updateCategoryCounts();
  };

  const createCertificateCardDOM = (cert) => {
    const article = document.createElement('article');
    article.className = 'cert-3d-card';
    article.dataset.id = cert.id;
    article.dataset.category = cert.category;

    // Display image or placeholder if PDF
    const isPdf = cert.image.endsWith('.pdf');
    const imageSrc = isPdf ? 'assets/coursera-canva-certificate.png' : cert.image;

    article.innerHTML = `
      <div class="cert-card-media">
        <img src="${imageSrc}" alt="${escapeHtml(cert.title)}" class="cert-thumbnail-img" loading="lazy">
        <div class="cert-inspect-badge font-mono">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>Inspect</span>
        </div>
      </div>
      <div class="cert-card-content">
        <div class="cert-meta-row font-mono">
          <span class="cert-cat-pill">${escapeHtml(cert.category)}</span>
          <span class="cert-date">${escapeHtml(cert.date)}</span>
        </div>
        <h3 class="cert-card-title">${escapeHtml(cert.title)}</h3>
        <p class="cert-card-issuer font-mono">${escapeHtml(cert.issuer)}</p>
        <p class="cert-card-desc">${escapeHtml(cert.description || '')}</p>
        
        <div class="cert-owner-actions admin-only">
          <button type="button" class="btn-card-action btn-edit" title="Edit details">✏️ Edit</button>
          <button type="button" class="btn-card-action btn-del" title="Remove achievement">🗑️ Delete</button>
        </div>
      </div>
    `;

    // 3D Tilt on Mouse Move
    article.addEventListener('mousemove', (e) => {
      const rect = article.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = -(y / (rect.height / 2)) * 5;
      const rotY = (x / (rect.width / 2)) * 5;
      article.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-8px)`;
    });

    article.addEventListener('mouseleave', () => {
      article.style.transform = '';
    });

    // Lightbox click on the media box or title
    article.querySelector('.cert-card-media').addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(cert);
    });

    article.querySelector('.cert-card-title').addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(cert);
    });

    // Owner Edit Button
    const editBtn = article.querySelector('.btn-edit');
    editBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditCertModal(cert);
    });

    // Owner Delete Button
    const delBtn = article.querySelector('.btn-del');
    delBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Remove "${cert.title}" from your gallery showroom?`)) {
        const certs = getCertificates().filter(c => c.id !== cert.id);
        saveCertificates(certs);
        renderCertificates();
        showToast('Achievement removed from gallery', '🗑️');
      }
    });

    return article;
  };

  const updateCategoryCounts = () => {
    const certs = getCertificates();
    const countAll = document.getElementById('count-all');
    const countAcademic = document.getElementById('count-academic');
    const countAi = document.getElementById('count-ai');
    const countNational = document.getElementById('count-national');
    const countTechnical = document.getElementById('count-technical');

    if (countAll) countAll.textContent = certs.length;
    if (countAcademic) countAcademic.textContent = certs.filter(c => c.category === 'academic').length;
    if (countAi) countAi.textContent = certs.filter(c => c.category === 'ai').length;
    if (countNational) countNational.textContent = certs.filter(c => c.category === 'national').length;
    if (countTechnical) countTechnical.textContent = certs.filter(c => c.category === 'technical').length;
  };

  // Filter Pill Click Handlers
  const filterPills = document.querySelectorAll('#cert-filter-pills .filter-pill');
  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      renderCertificates();
    });
  });

  // Marquee Controls: Play/Pause Toggle
  marqueeTogglePlay?.addEventListener('click', () => {
    isMarqueePaused = !isMarqueePaused;
    if (marqueeShowroom) {
      marqueeShowroom.classList.toggle('is-paused', isMarqueePaused);
    }
    if (marqueePlayIcon) marqueePlayIcon.textContent = isMarqueePaused ? '▶️' : '⏸️';
    if (marqueePlayLabel) marqueePlayLabel.textContent = isMarqueePaused ? 'Resume Flow' : 'Pause Flow';
    showToast(isMarqueePaused ? 'Marquee stream paused' : 'Marquee stream resumed', isMarqueePaused ? '⏸️' : '▶️');
  });

  // Marquee Controls: Direction Reverse Toggle (Bi-Directional Flip)
  marqueeToggleDir?.addEventListener('click', () => {
    isDirectionReversed = !isDirectionReversed;
    if (marqueeShowroom) {
      marqueeShowroom.classList.toggle('direction-reversed', isDirectionReversed);
    }
    showToast(isDirectionReversed ? 'Marquee directions reversed ⇄' : 'Marquee directions normalized ⇄', '🔄');
  });

  // Marquee Controls: View Toggle (Marquee Flow vs Classic Grid)
  marqueeToggleView?.addEventListener('click', () => {
    currentViewMode = currentViewMode === 'marquee' ? 'grid' : 'marquee';
    if (currentViewMode === 'grid') {
      if (marqueeShowroom) marqueeShowroom.style.display = 'none';
      if (galleryGrid) galleryGrid.style.display = 'grid';
      if (marqueeViewIcon) marqueeViewIcon.textContent = '📜';
      if (marqueeViewLabel) marqueeViewLabel.textContent = 'Marquee View';
      marqueeToggleView.classList.add('active');
      showToast('Switched to Grid View', '🔲');
    } else {
      if (marqueeShowroom) marqueeShowroom.style.display = 'flex';
      if (galleryGrid) galleryGrid.style.display = 'none';
      if (marqueeViewIcon) marqueeViewIcon.textContent = '🔲';
      if (marqueeViewLabel) marqueeViewLabel.textContent = 'Grid View';
      marqueeToggleView.classList.remove('active');
      showToast('Switched to Bi-Directional Infinite Marquee', '🌿');
    }
  });

  // ---------------------------------------------------------------------------
  // 04. LIGHTBOX MODAL INSPECTOR
  // ---------------------------------------------------------------------------
  const lightboxDialog = document.getElementById('certificate-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxIssuer = document.getElementById('lightbox-issuer');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  const openLightbox = (cert) => {
    if (!lightboxDialog) return;
    const isPdf = cert.image.endsWith('.pdf');
    lightboxImg.src = isPdf ? 'assets/coursera-canva-certificate.png' : cert.image;
    lightboxImg.alt = cert.title;
    lightboxTitle.textContent = cert.title;
    lightboxIssuer.textContent = `${cert.issuer} • ${cert.date}`;
    lightboxCategory.textContent = cert.category.toUpperCase();
    lightboxDesc.textContent = cert.description || 'Verified academic and technical distinction.';

    lightboxDialog.showModal();
  };

  lightboxCloseBtn?.addEventListener('click', () => lightboxDialog?.close());
  lightboxDialog?.addEventListener('click', (e) => {
    if (e.target === lightboxDialog) lightboxDialog.close();
  });

  // ---------------------------------------------------------------------------
  // 05. OWNER ADMIN AUTHENTICATION ENGINE
  // ---------------------------------------------------------------------------
  const adminHud = document.getElementById('admin-hud');
  const passcodeDialog = document.getElementById('owner-passcode-dialog');
  const passcodeCloseBtn = document.getElementById('passcode-close-btn');
  const passcodeForm = document.getElementById('passcode-form');
  const pinDotsRow = document.getElementById('pin-dots-row');
  const pinHiddenInput = document.getElementById('pin-hidden-input');
  const passcodeErrorMsg = document.getElementById('passcode-error-msg');
  const footerAdminTrigger = document.getElementById('footer-admin-trigger');
  const hudExitBtn = document.getElementById('hud-exit-btn');
  const profileFrame = document.getElementById('profile-frame');

  let enteredPin = '';

  const updateAdminModeUI = () => {
    const isAuth = isAdminAuthenticated();
    if (isAuth) {
      document.body.classList.add('admin-mode-active');
      if (adminHud) adminHud.style.display = 'block';
    } else {
      document.body.classList.remove('admin-mode-active');
      if (adminHud) adminHud.style.display = 'none';
    }
  };

  const openPasscodeModal = () => {
    enteredPin = '';
    updatePinDots();
    if (passcodeErrorMsg) passcodeErrorMsg.style.display = 'none';
    passcodeDialog?.showModal();
    pinHiddenInput?.focus();
  };

  const updatePinDots = () => {
    const dots = pinDotsRow?.querySelectorAll('.pin-dot');
    dots?.forEach((dot, index) => {
      if (index < enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  };

  // Keyboard and Numpad Handling for PIN
  document.querySelectorAll('.numpad-btn[data-val]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (enteredPin.length < 8) {
        enteredPin += btn.dataset.val;
        updatePinDots();
      }
    });
  });

  document.getElementById('numpad-clear')?.addEventListener('click', () => {
    enteredPin = '';
    updatePinDots();
  });

  document.getElementById('numpad-backspace')?.addEventListener('click', () => {
    enteredPin = enteredPin.slice(0, -1);
    updatePinDots();
  });

  pinHiddenInput?.addEventListener('input', (e) => {
    enteredPin = e.target.value;
    updatePinDots();
  });

  passcodeForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const correctPin = getAdminPin();
    if (enteredPin === correctPin) {
      sessionStorage.setItem('bbn_nature_session', 'unlocked');
      passcodeDialog?.close();
      updateAdminModeUI();
      showToast('Welcome, Bibek! Curator editing privileges unlocked.', '🌿');
    } else {
      if (passcodeErrorMsg) passcodeErrorMsg.style.display = 'block';
      pinDotsRow?.classList.add('shake');
      setTimeout(() => pinDotsRow?.classList.remove('shake'), 450);
      enteredPin = '';
      updatePinDots();
    }
  });

  passcodeCloseBtn?.addEventListener('click', () => passcodeDialog?.close());
  passcodeDialog?.addEventListener('click', (e) => {
    if (e.target === passcodeDialog) passcodeDialog.close();
  });

  // Triggers to open Admin Passcode Modal
  footerAdminTrigger?.addEventListener('click', openPasscodeModal);

  // Secret Shortcut: Ctrl+Shift+A or Alt+A
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
      e.preventDefault();
      if (isAdminAuthenticated()) {
        showToast('You are already authenticated in Curator mode', '🌿');
      } else {
        openPasscodeModal();
      }
    }
  });

  // Secret Double-Click on Pebble Portrait Frame
  profileFrame?.addEventListener('dblclick', () => {
    if (!isAdminAuthenticated()) {
      openPasscodeModal();
    }
  });

  // Lock / Exit Admin Mode
  hudExitBtn?.addEventListener('click', () => {
    sessionStorage.removeItem('bbn_nature_session');
    updateAdminModeUI();
    showToast('Exited Curator Mode. Public view restored.', '🔒');
  });

  // ---------------------------------------------------------------------------
  // 06. ADD & EDIT CERTIFICATE MODAL
  // ---------------------------------------------------------------------------
  const addCertDialog = document.getElementById('add-cert-dialog');
  const addCertCloseBtn = document.getElementById('add-cert-close-btn');
  const addCertCancelBtn = document.getElementById('add-cert-cancel-btn');
  const addCertForm = document.getElementById('add-cert-form');
  const addCertTitle = document.getElementById('add-cert-title');
  const editCertId = document.getElementById('edit-cert-id');

  const certInputTitle = document.getElementById('cert-input-title');
  const certInputIssuer = document.getElementById('cert-input-issuer');
  const certInputDate = document.getElementById('cert-input-date');
  const certInputCategory = document.getElementById('cert-input-category');
  const certInputDesc = document.getElementById('cert-input-desc');
  const certFileInput = document.getElementById('cert-file-input');
  const certUrlInput = document.getElementById('cert-url-input');
  const certDropzone = document.getElementById('cert-dropzone');
  const certPreviewBox = document.getElementById('cert-preview-box');
  const certPreviewImg = document.getElementById('cert-preview-img');

  let activeCertImageBase64 = '';

  const resetCertForm = () => {
    addCertForm?.reset();
    editCertId.value = '';
    activeCertImageBase64 = '';
    if (certPreviewBox) certPreviewBox.style.display = 'none';
    addCertTitle.textContent = 'Add New Achievement';
  };

  const openAddCertModal = () => {
    resetCertForm();
    addCertDialog?.showModal();
  };

  const openEditCertModal = (cert) => {
    resetCertForm();
    addCertTitle.textContent = 'Edit Achievement';
    editCertId.value = cert.id;
    certInputTitle.value = cert.title;
    certInputIssuer.value = cert.issuer;
    certInputDate.value = cert.date;
    certInputCategory.value = cert.category;
    certInputDesc.value = cert.description || '';
    activeCertImageBase64 = cert.image;

    if (certPreviewBox && certPreviewImg) {
      certPreviewImg.src = cert.image;
      certPreviewBox.style.display = 'flex';
    }

    addCertDialog?.showModal();
  };

  document.getElementById('btn-open-add-cert')?.addEventListener('click', openAddCertModal);
  document.getElementById('hud-add-cert-btn')?.addEventListener('click', openAddCertModal);
  addCertCloseBtn?.addEventListener('click', () => addCertDialog?.close());
  addCertCancelBtn?.addEventListener('click', () => addCertDialog?.close());

  // Dropzone file handling
  certDropzone?.addEventListener('click', () => certFileInput?.click());
  certFileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        activeCertImageBase64 = event.target.result;
        if (certPreviewBox && certPreviewImg) {
          certPreviewImg.src = activeCertImageBase64;
          certPreviewBox.style.display = 'flex';
        }
      };
      reader.readAsDataURL(file);
    }
  });

  certUrlInput?.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    if (url) {
      activeCertImageBase64 = url;
      if (certPreviewBox && certPreviewImg) {
        certPreviewImg.src = url;
        certPreviewBox.style.display = 'flex';
      }
    }
  });

  addCertForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = certInputTitle.value.trim();
    const issuer = certInputIssuer.value.trim();
    const date = certInputDate.value.trim();
    const category = certInputCategory.value;
    const desc = certInputDesc.value.trim();
    const image = activeCertImageBase64 || 'assets/bonafide-project-certificate.jpg';

    const certs = getCertificates();
    const existingId = editCertId.value;

    if (existingId) {
      // Update existing
      const index = certs.findIndex(c => c.id === existingId);
      if (index !== -1) {
        certs[index] = {
          ...certs[index],
          title,
          issuer,
          date,
          category,
          description: desc,
          image
        };
        showToast(`Achievement "${title}" updated!`, '✨');
      }
    } else {
      // Add new
      const newCert = {
        id: `cert-custom-${Date.now()}`,
        title,
        issuer,
        date,
        category,
        description: desc,
        image,
        badge: 'Verified Credential'
      };
      certs.unshift(newCert);
      showToast(`New achievement "${title}" added to gallery!`, '🌱');
    }

    saveCertificates(certs);
    renderCertificates();
    addCertDialog?.close();
  });

  // ---------------------------------------------------------------------------
  // 07. PROFILE PHOTO MANAGER ENGINE
  // ---------------------------------------------------------------------------
  const avatarDialog = document.getElementById('avatar-manager-dialog');
  const avatarCloseBtn = document.getElementById('avatar-dialog-close-btn');
  const hudAvatarBtn = document.getElementById('hud-edit-avatar-btn');
  const avatarChangeTrigger = document.getElementById('avatar-change-trigger');
  const avatarFileInput = document.getElementById('avatar-file-input');
  const avatarUrlInput = document.getElementById('avatar-url-input');
  const avatarLivePreview = document.getElementById('avatar-live-preview');
  const avatarSaveBtn = document.getElementById('avatar-save-btn');
  const avatarResetBtn = document.getElementById('avatar-reset-default-btn');
  const mainProfileImg = document.getElementById('main-profile-img');

  let pendingAvatarBase64 = '';

  const initProfilePhoto = () => {
    const saved = localStorage.getItem('bbn_nature_avatar');
    if (saved && mainProfileImg) {
      mainProfileImg.src = saved;
      if (avatarLivePreview) avatarLivePreview.src = saved;
    }
  };

  const openAvatarDialog = () => {
    pendingAvatarBase64 = mainProfileImg?.src || 'assets/profile.jpg';
    if (avatarLivePreview) avatarLivePreview.src = pendingAvatarBase64;
    avatarDialog?.showModal();
  };

  hudAvatarBtn?.addEventListener('click', openAvatarDialog);
  avatarChangeTrigger?.addEventListener('click', openAvatarDialog);
  avatarCloseBtn?.addEventListener('click', () => avatarDialog?.close());

  avatarFileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        pendingAvatarBase64 = event.target.result;
        if (avatarLivePreview) avatarLivePreview.src = pendingAvatarBase64;
      };
      reader.readAsDataURL(file);
    }
  });

  avatarUrlInput?.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    if (url) {
      pendingAvatarBase64 = url;
      if (avatarLivePreview) avatarLivePreview.src = url;
    }
  });

  avatarSaveBtn?.addEventListener('click', () => {
    if (pendingAvatarBase64) {
      localStorage.setItem('bbn_nature_avatar', pendingAvatarBase64);
      if (mainProfileImg) mainProfileImg.src = pendingAvatarBase64;
      avatarDialog?.close();
      showToast('Profile portrait photo updated successfully!', '📷');
    }
  });

  avatarResetBtn?.addEventListener('click', () => {
    localStorage.removeItem('bbn_nature_avatar');
    if (mainProfileImg) mainProfileImg.src = 'assets/profile.jpg';
    if (avatarLivePreview) avatarLivePreview.src = 'assets/profile.jpg';
    avatarDialog?.close();
    showToast('Reset to default portrait photo', '🌿');
  });

  // ---------------------------------------------------------------------------
  // 08. JOURNEY NARRATIVE LIVE EDITOR
  // ---------------------------------------------------------------------------
  const journeyDialog = document.getElementById('edit-journey-dialog');
  const journeyCloseBtn = document.getElementById('journey-dialog-close-btn');
  const journeyCancelBtn = document.getElementById('journey-cancel-btn');
  const journeyForm = document.getElementById('edit-journey-form');
  const hudJourneyBtn = document.getElementById('hud-edit-journey-btn');
  const heroEditTrigger = document.getElementById('hero-edit-trigger');

  const heroHeadingDisplay = document.getElementById('hero-heading-display');
  const heroTaglineDisplay = document.getElementById('hero-tagline-display');
  const heroQuoteDisplay = document.getElementById('hero-quote-display');

  const journeyInputHeading = document.getElementById('journey-input-heading');
  const journeyInputTagline = document.getElementById('journey-input-tagline');
  const journeyInputQuote = document.getElementById('journey-input-quote');

  const initJourneyNarrative = () => {
    try {
      const saved = localStorage.getItem('bbn_nature_journey');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.heading && heroHeadingDisplay) heroHeadingDisplay.textContent = data.heading;
        if (data.tagline && heroTaglineDisplay) heroTaglineDisplay.innerHTML = data.tagline;
        if (data.quote && heroQuoteDisplay) heroQuoteDisplay.textContent = data.quote;
      }
    } catch (e) {
      console.warn('Could not read journey text:', e);
    }
  };

  const openJourneyDialog = () => {
    if (journeyInputHeading) journeyInputHeading.value = heroHeadingDisplay?.textContent.trim() || '';
    if (journeyInputTagline) journeyInputTagline.value = heroTaglineDisplay?.textContent.trim() || '';
    if (journeyInputQuote) journeyInputQuote.value = heroQuoteDisplay?.textContent.trim() || '';
    journeyDialog?.showModal();
  };

  hudJourneyBtn?.addEventListener('click', openJourneyDialog);
  heroEditTrigger?.addEventListener('click', openJourneyDialog);
  journeyCloseBtn?.addEventListener('click', () => journeyDialog?.close());
  journeyCancelBtn?.addEventListener('click', () => journeyDialog?.close());

  journeyForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const heading = journeyInputHeading.value.trim();
    const tagline = journeyInputTagline.value.trim();
    const quote = journeyInputQuote.value.trim();

    if (heroHeadingDisplay) heroHeadingDisplay.textContent = heading;
    if (heroTaglineDisplay) heroTaglineDisplay.textContent = tagline;
    if (heroQuoteDisplay) heroQuoteDisplay.textContent = quote;

    localStorage.setItem('bbn_nature_journey', JSON.stringify({ heading, tagline, quote }));
    journeyDialog?.close();
    showToast('Hero narrative saved!', '📝');
  });

  // ---------------------------------------------------------------------------
  // 09. BACKUP, EXPORT & RESTORE ENGINE
  // ---------------------------------------------------------------------------
  const backupDialog = document.getElementById('backup-dialog');
  const backupCloseBtn = document.getElementById('backup-dialog-close-btn');
  const hudBackupBtn = document.getElementById('hud-backup-btn');
  const btnExportBackup = document.getElementById('btn-export-backup-json');
  const btnCopyBackup = document.getElementById('btn-copy-backup-json');
  const backupFileInput = document.getElementById('backup-file-input');
  const btnRestoreDefaults = document.getElementById('btn-restore-defaults');

  hudBackupBtn?.addEventListener('click', () => backupDialog?.showModal());
  backupCloseBtn?.addEventListener('click', () => backupDialog?.close());

  const generateBackupPayload = () => {
    return JSON.stringify({
      certificates: getCertificates(),
      avatar: localStorage.getItem('bbn_nature_avatar') || null,
      journey: localStorage.getItem('bbn_nature_journey') || null,
      pin: getAdminPin(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  };

  btnExportBackup?.addEventListener('click', () => {
    const payload = generateBackupPayload();
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bibek-botanical-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON file downloaded!', '💾');
  });

  btnCopyBackup?.addEventListener('click', async () => {
    const payload = generateBackupPayload();
    try {
      await navigator.clipboard.writeText(payload);
      showToast('Backup JSON copied to clipboard!', '📋');
    } catch (err) {
      showToast('Could not copy automatically', '⚠️');
    }
  });

  backupFileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (Array.isArray(data.certificates)) {
            saveCertificates(data.certificates);
          }
          if (data.avatar) {
            localStorage.setItem('bbn_nature_avatar', data.avatar);
          }
          if (data.journey) {
            localStorage.setItem('bbn_nature_journey', typeof data.journey === 'string' ? data.journey : JSON.stringify(data.journey));
          }
          if (data.pin) {
            localStorage.setItem('bbn_nature_pin', data.pin);
          }
          renderCertificates();
          initProfilePhoto();
          initJourneyNarrative();
          backupDialog?.close();
          showToast('Portfolio restored from snapshot!', '🌿');
        } catch (err) {
          alert('Invalid backup JSON file.');
        }
      };
      reader.readAsText(file);
    }
  });

  btnRestoreDefaults?.addEventListener('click', () => {
    if (confirm('Restore factory defaults? This resets added certificates to the original 12 core accreditations.')) {
      localStorage.removeItem('bbn_nature_certificates');
      localStorage.removeItem('bbn_nature_avatar');
      localStorage.removeItem('bbn_nature_journey');
      localStorage.removeItem('bbn_nature_pin');
      renderCertificates();
      initProfilePhoto();
      initJourneyNarrative();
      backupDialog?.close();
      showToast('Factory defaults restored', '🌿');
    }
  });

  // ---------------------------------------------------------------------------
  // 10. GITHUB CLOUD SYNCHRONIZER (DIRECT REPOSITORY PUBLISHER)
  // ---------------------------------------------------------------------------
  const githubSyncDialog = document.getElementById('github-sync-dialog');
  const githubSyncCloseBtn = document.getElementById('github-sync-close-btn');
  const githubSyncCancelBtn = document.getElementById('github-sync-cancel-btn');
  const githubSyncForm = document.getElementById('github-sync-form');
  const hudGithubPublishBtn = document.getElementById('hud-github-publish-btn');
  const ghTokenInput = document.getElementById('gh-token-input');
  const ghTokenToggleBtn = document.getElementById('gh-token-toggle-btn');
  const ghCommitMsgInput = document.getElementById('gh-commit-msg-input');
  const ghSyncCertCount = document.getElementById('gh-sync-cert-count');
  const githubSyncStatusBox = document.getElementById('github-sync-status-box');
  const githubSyncSubmitBtn = document.getElementById('github-sync-submit-btn');
  const githubSyncBtnText = document.getElementById('github-sync-btn-text');

  // Open GitHub Publish Modal
  hudGithubPublishBtn?.addEventListener('click', () => {
    if (!githubSyncDialog) return;
    
    // Pre-fill token from localStorage if saved
    const savedToken = localStorage.getItem('bbn_gh_token');
    if (savedToken && ghTokenInput) {
      ghTokenInput.value = savedToken;
    }

    // Update cert count
    if (ghSyncCertCount) {
      ghSyncCertCount.textContent = getCertificates().length;
    }

    if (githubSyncStatusBox) {
      githubSyncStatusBox.style.display = 'none';
      githubSyncStatusBox.innerHTML = '';
    }

    githubSyncDialog.showModal();
  });

  githubSyncCloseBtn?.addEventListener('click', () => githubSyncDialog?.close());
  githubSyncCancelBtn?.addEventListener('click', () => githubSyncDialog?.close());

  // Show/Hide token password toggle
  ghTokenToggleBtn?.addEventListener('click', () => {
    if (!ghTokenInput) return;
    const isPass = ghTokenInput.type === 'password';
    ghTokenInput.type = isPass ? 'text' : 'password';
    ghTokenToggleBtn.textContent = isPass ? '🙈' : '👁️';
  });

  // Handle GitHub Sync Form Submit
  githubSyncForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = ghTokenInput?.value.trim();
    if (!token) {
      alert('Please enter your GitHub Personal Access Token.');
      return;
    }

    const customMsg = ghCommitMsgInput?.value.trim();
    const setStatus = (msg, type = 'info') => {
      if (!githubSyncStatusBox) return;
      githubSyncStatusBox.style.display = 'block';
      githubSyncStatusBox.className = `github-status-box ${type}`;
      githubSyncStatusBox.innerHTML = msg;
    };

    try {
      if (githubSyncSubmitBtn) githubSyncSubmitBtn.disabled = true;
      if (githubSyncBtnText) githubSyncBtnText.textContent = '⏳ Publishing...';
      setStatus('🔍 Authenticating with GitHub API...', 'info');

      const repo = 'bibekgit2007/bibek-portfolio';
      const filePath = 'data/portfolio-data.json';
      const fileUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

      // 1. Fetch current SHA if exists
      let existingSha = null;
      try {
        const getRes = await fetch(fileUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (getRes.status === 401) {
          throw new Error('Unauthorized: Invalid GitHub Personal Access Token. Verify token is active with Contents (Read & Write) permission.');
        }

        if (getRes.ok) {
          const fileInfo = await getRes.json();
          existingSha = fileInfo.sha;
        }
      } catch (err) {
        if (err.message.includes('Unauthorized')) throw err;
      }

      setStatus('📦 Compiling latest portfolio achievements and text...', 'info');

      // 2. Prepare payload
      const currentJourney = localStorage.getItem('bbn_nature_journey');
      let journeyData = {};
      if (currentJourney) {
        try { journeyData = JSON.parse(currentJourney); } catch(e){}
      }

      const currentSections = localStorage.getItem('bbn_nature_sections');
      let sectionData = {};
      if (currentSections) {
        try { sectionData = JSON.parse(currentSections); } catch(e){}
      }

      const payloadData = {
        lastUpdated: new Date().toISOString(),
        version: '1.0.0',
        hero: {
          kicker: sectionData.kicker || document.querySelector('.botanical-pill .pill-text')?.textContent.trim() || 'NATURE JOURNAL • VOL. 2026 // CSE EDITION',
          name: sectionData.name || heroHeadingDisplay?.textContent.trim() || 'Bibek Bandhu Nayek',
          tagline: journeyData.tagline || heroTaglineDisplay?.innerHTML.trim() || '',
          quote: journeyData.quote || heroQuoteDisplay?.textContent.trim() || ''
        },
        about: {
          location: sectionData.location || 'Debra, Paschim Medinipur, West Bengal'
        },
        certificates: getCertificates()
      };

      const jsonString = JSON.stringify(payloadData, null, 2);
      // UTF-8 safe base64 encoding
      const base64Content = btoa(unescape(encodeURIComponent(jsonString)));

      setStatus('🚀 Pushing commit to GitHub repository...', 'info');

      const commitMessage = customMsg || `chore: update portfolio content from Gardener Mode (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`;

      const putBody = {
        message: commitMessage,
        content: base64Content,
        branch: 'main'
      };
      if (existingSha) {
        putBody.sha = existingSha;
      }

      const putRes = await fetch(fileUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(putBody)
      });

      if (!putRes.ok) {
        const errData = await putRes.json();
        throw new Error(errData.message || 'GitHub API rejected commit');
      }

      const result = await putRes.json();
      const commitSha = result.commit?.sha ? result.commit.sha.substring(0, 7) : 'main';

      setStatus(`🎉 <strong>Published Successfully!</strong><br>Commit <code>${commitSha}</code> created on <code>main</code>.<br>GitHub Pages &amp; Vercel are rebuilding your live website now! (Takes ~30 seconds)`, 'success');
      showToast('Published live to GitHub! 🎉', '🚀');

      // Save token securely for future one-click publishing
      localStorage.setItem('bbn_gh_token', token);

    } catch (err) {
      setStatus(`❌ <strong>Publish Failed:</strong> ${escapeHtml(err.message)}`, 'error');
      showToast('Publish failed. Check token.', '⚠️');
    } finally {
      if (githubSyncSubmitBtn) githubSyncSubmitBtn.disabled = false;
      if (githubSyncBtnText) githubSyncBtnText.textContent = '🚀 Commit & Push Live';
    }
  });

  // ---------------------------------------------------------------------------
  // 11. SECTION CONTENT & DETAILS LIVE EDITOR
  // ---------------------------------------------------------------------------
  const editSectionsDialog = document.getElementById('edit-sections-dialog');
  const editSectionsCloseBtn = document.getElementById('edit-sections-close-btn');
  const editSectionsCancelBtn = document.getElementById('edit-sections-cancel-btn');
  const editSectionsForm = document.getElementById('edit-sections-form');
  const hudEditSectionsBtn = document.getElementById('hud-edit-sections-btn');

  const secHeroKicker = document.getElementById('sec-hero-kicker');
  const secHeroName = document.getElementById('sec-hero-name');
  const secAboutLocation = document.getElementById('sec-about-location');
  const secHeroTagline = document.getElementById('sec-hero-tagline');
  const secHeroQuote = document.getElementById('sec-hero-quote');

  const initSectionContent = () => {
    try {
      const saved = localStorage.getItem('bbn_nature_sections');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.kicker) {
          const pill = document.querySelector('.botanical-pill .pill-text');
          if (pill) pill.textContent = data.kicker;
        }
        if (data.name && heroHeadingDisplay) {
          heroHeadingDisplay.textContent = data.name;
        }
        if (data.location) {
          document.querySelectorAll('.specimen-coordinates span, .journey-quote-footer span').forEach(el => {
            if (el.textContent.includes('Debra') || el.textContent.includes('Medinipur')) {
              el.textContent = `📍 ${data.location}`;
            }
          });
        }
      }
    } catch (e) {
      console.warn('Could not read section contents:', e);
    }
  };

  hudEditSectionsBtn?.addEventListener('click', () => {
    if (!editSectionsDialog) return;
    const pill = document.querySelector('.botanical-pill .pill-text');
    if (secHeroKicker) secHeroKicker.value = pill?.textContent.trim() || '';
    if (secHeroName) secHeroName.value = heroHeadingDisplay?.textContent.trim() || '';
    if (secHeroTagline) secHeroTagline.value = heroTaglineDisplay?.textContent.trim() || '';
    if (secHeroQuote) secHeroQuote.value = heroQuoteDisplay?.textContent.trim() || '';
    if (secAboutLocation) secAboutLocation.value = 'Debra, Paschim Medinipur, West Bengal';

    editSectionsDialog.showModal();
  });

  editSectionsCloseBtn?.addEventListener('click', () => editSectionsDialog?.close());
  editSectionsCancelBtn?.addEventListener('click', () => editSectionsDialog?.close());

  editSectionsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const kicker = secHeroKicker?.value.trim();
    const name = secHeroName?.value.trim();
    const tagline = secHeroTagline?.value.trim();
    const quote = secHeroQuote?.value.trim();
    const location = secAboutLocation?.value.trim();

    if (kicker) {
      const pill = document.querySelector('.botanical-pill .pill-text');
      if (pill) pill.textContent = kicker;
    }
    if (name && heroHeadingDisplay) {
      heroHeadingDisplay.textContent = name;
    }
    if (tagline && heroTaglineDisplay) {
      heroTaglineDisplay.innerHTML = tagline;
    }
    if (quote && heroQuoteDisplay) {
      heroQuoteDisplay.textContent = quote;
    }

    localStorage.setItem('bbn_nature_sections', JSON.stringify({ kicker, name, tagline, quote, location }));
    editSectionsDialog?.close();
    showToast('Content updated! Click "🚀 Publish to GitHub" to go live.', '✏️');
  });

  // ---------------------------------------------------------------------------
  // 12. CHANGE PASSCODE ENGINE
  // ---------------------------------------------------------------------------
  const changePinDialog = document.getElementById('change-pin-dialog');
  const changePinCloseBtn = document.getElementById('change-pin-close-btn');
  const changePinCancelBtn = document.getElementById('change-pin-cancel-btn');
  const changePinForm = document.getElementById('change-pin-form');
  const hudPinBtn = document.getElementById('hud-pin-btn');

  hudPinBtn?.addEventListener('click', () => changePinDialog?.showModal());
  changePinCloseBtn?.addEventListener('click', () => changePinDialog?.close());
  changePinCancelBtn?.addEventListener('click', () => changePinDialog?.close());

  changePinForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const oldPin = document.getElementById('old-pin-input')?.value.trim();
    const newPin = document.getElementById('new-pin-input')?.value.trim();
    const confirmPin = document.getElementById('confirm-pin-input')?.value.trim();

    if (oldPin !== getAdminPin()) {
      alert('Current passcode is incorrect.');
      return;
    }
    if (!newPin || newPin.length < 4 || newPin.length > 8) {
      alert('New passcode must be between 4 and 8 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      alert('New passcode and confirmation do not match.');
      return;
    }

    localStorage.setItem('bbn_nature_pin', newPin);
    changePinDialog?.close();
    showToast('Master passcode updated successfully!', '🔑');
  });

  // ---------------------------------------------------------------------------
  // 11. LIVE IST CLOCK
  // ---------------------------------------------------------------------------
  const initLiveIstClock = () => {
    const clockEl = document.getElementById('botanical-ist-clock');
    if (!clockEl) return;
    const update = () => {
      const now = new Date();
      const options = { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
      const timeStr = now.toLocaleTimeString('en-US', options);
      clockEl.textContent = `Kolkata, WB (IST) — ${timeStr}`;
    };
    update();
    setInterval(update, 1000);
  };

  // ---------------------------------------------------------------------------
  // 12. WISDOM READING ROOM & LUMINARY QUOTES
  // ---------------------------------------------------------------------------
  const WISDOM_QUOTES = [
    {
      author: 'Bill Gates',
      monogram: 'BG',
      title: 'Co-Founder of Microsoft • Global Technologist',
      domain: 'SOFTWARE CRAFT',
      quote: '“Software is a magnificent combination between artistry and engineering. Patience, continuous learning, and curiosity are the keys to revolutionizing the world.”'
    },
    {
      author: 'Sir Isaac Newton',
      monogram: 'IN',
      title: 'Polymath • Pioneer of Calculus & Mechanics',
      domain: 'MATHEMATICAL NATURALIS',
      quote: '“If I have seen further than others, it is by standing upon the shoulders of Giants. What we know is a drop; what we do not know is an ocean.”'
    },
    {
      author: 'Stephen Hawking',
      monogram: 'SH',
      title: 'Theoretical Physicist & Cosmologist',
      domain: 'THEORETICAL FRONTIERS',
      quote: '“Remember to look up at the stars and not down at your feet. Try to make sense of what you see and wonder about what makes the universe exist. Be curious. Intelligence is the ability to adapt to change.”'
    },
    {
      author: 'Mahatma Gandhi',
      monogram: 'MG',
      title: 'Father of the Nation • Champion of Truth',
      domain: 'UNWAVERING INTEGRITY',
      quote: '“Live as if you were to die tomorrow. Learn as if you were to live forever. The future depends entirely on what you do today.”'
    },
    {
      author: 'Elon Musk',
      monogram: 'EM',
      title: 'Chief Engineer @ SpaceX & Tesla',
      domain: 'FIRST PRINCIPLES',
      quote: '“When something is important enough, you do it even if the odds are not in your favor. Physics is the ultimate framework for first-principles thinking—boil things down to fundamental truths.”'
    },
    {
      author: 'Swami Vivekananda',
      monogram: 'SV',
      title: 'Vedantic Philosopher & Global Teacher',
      domain: 'VEDANTIC ETHOS',
      quote: '“Arise, awake, and stop not till the goal is reached. Purity, patience, and perseverance are the three essentials to success, and above all: love.”'
    }
  ];

  let currentWisdomIdx = 0;
  const initWisdomReadingRoom = () => {
    const quoteEl = document.getElementById('active-wisdom-quote');
    const nameEl = document.getElementById('active-wisdom-name');
    const titleEl = document.getElementById('active-wisdom-title');
    const domainEl = document.getElementById('active-wisdom-domain');
    const monoEl = document.getElementById('active-wisdom-monogram');
    const shuffleBtn = document.getElementById('btn-shuffle-wisdom');
    const copyBtn = document.getElementById('btn-copy-wisdom');
    const copyText = document.getElementById('copy-wisdom-text');

    const renderWisdom = (idx) => {
      const q = WISDOM_QUOTES[idx];
      if (!q || !quoteEl) return;
      quoteEl.style.opacity = '0';
      quoteEl.style.transform = 'translateY(6px)';
      quoteEl.style.transition = 'all 0.25s ease';
      setTimeout(() => {
        quoteEl.textContent = q.quote;
        if (nameEl) nameEl.textContent = q.author;
        if (titleEl) titleEl.textContent = q.title;
        if (domainEl) domainEl.textContent = q.domain;
        if (monoEl) monoEl.textContent = q.monogram;
        quoteEl.style.opacity = '1';
        quoteEl.style.transform = 'translateY(0)';
      }, 250);
    };

    shuffleBtn?.addEventListener('click', () => {
      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * WISDOM_QUOTES.length);
      } while (nextIdx === currentWisdomIdx && WISDOM_QUOTES.length > 1);
      currentWisdomIdx = nextIdx;
      renderWisdom(currentWisdomIdx);
    });

    copyBtn?.addEventListener('click', async () => {
      const q = WISDOM_QUOTES[currentWisdomIdx];
      try {
        await navigator.clipboard.writeText(`${q.quote} — ${q.author}`);
        if (copyText) copyText.textContent = 'Copied!';
        showToast('Quote copied to clipboard', '🌿');
        setTimeout(() => {
          if (copyText) copyText.textContent = 'Copy Quote';
        }, 2000);
      } catch (e) {
        showToast('Failed to copy', '⚠️');
      }
    });
  };

  // ---------------------------------------------------------------------------
  // 13. 52-WEEK BOTANICAL ENGINEERING COMMIT HEATMAP
  // ---------------------------------------------------------------------------
  const initGitHubActivityHeatmap = () => {
    const grid = document.getElementById('github-heatmap-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const totalDays = 52 * 7;
    const today = new Date();

    const commitSnippets = [
      "feat: constant-time HMAC signature verify",
      "perf: 200 FPS canvas telemetry synchronization",
      "sec: raw socket SYN-flood anomaly audit",
      "algo: Dijkstra benchmark in C",
      "data: Bayesian knowledge tracing model",
      "refactor: botanical theme design tokens"
    ];

    const fragment = document.createDocumentFragment();
    for (let i = totalDays - 1; i >= 0; i--) {
      const cellDate = new Date(today);
      cellDate.setDate(today.getDate() - i);
      const dateStr = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';

      const rand = Math.random();
      let level = 0;
      let count = 0;
      if (rand > 0.45) {
        if (rand > 0.88) { level = 4; count = Math.floor(Math.random() * 4) + 6; }
        else if (rand > 0.72) { level = 3; count = Math.floor(Math.random() * 3) + 3; }
        else if (rand > 0.58) { level = 2; count = 2; }
        else { level = 1; count = 1; }
      }
      cell.classList.add(`lvl-${level}`);

      const snippet = commitSnippets[Math.floor(Math.random() * commitSnippets.length)];
      cell.title = count > 0 
        ? `${dateStr}: ${count} verified commit${count > 1 ? 's' : ''} (${snippet})`
        : `${dateStr}: Rest & deep reading`;

      fragment.appendChild(cell);
    }
    grid.appendChild(fragment);
  };

  // ---------------------------------------------------------------------------
  // 14. AVAI PREPARATION INTERACTIVE SIMULATOR (CANVAS + DRILL + RADAR)
  // ---------------------------------------------------------------------------
  const initAvaiSimulatorEngine = () => {
    // Tab Switching
    const simTabBtns = document.querySelectorAll('.sim-tab-btn');
    const simPanes = document.querySelectorAll('.sim-pane');

    simTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        simTabBtns.forEach(b => b.classList.remove('active'));
        simPanes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(`pane-sim-${btn.dataset.tab}`);
        if (target) target.classList.add('active');

        if (btn.dataset.tab === 'radar') renderRadarChart();
      });
    });

    // Tab 1: Neural Canvas
    const canvas = document.getElementById('avai-neural-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const nodes = [
        { x: 80, y: 80, r: 9, label: 'Zero-Trust Protocol', desc: 'Cryptographic token validation verifying mutual authenticity.' },
        { x: 180, y: 140, r: 7, label: 'Packet Sniffer (C)', desc: 'Raw socket frame inspection parsing IPv4, TCP, and UDP headers.' },
        { x: 300, y: 70, r: 8, label: 'Bayesian Tracing', desc: 'Continuous probabilistic knowledge estimation from response telemetry.' },
        { x: 420, y: 130, r: 10, label: '200 FPS Telemetry', desc: 'Hardware-accelerated sub-millisecond timer pipeline.' },
        { x: 520, y: 80, r: 7, label: 'Graph Pathfinding', desc: 'Dijkstra and A* shortest-path benchmarks in low-level memory.' },
        { x: 140, y: 230, r: 8, label: 'HMAC-SHA256', desc: 'Constant-time message integrity validation.' },
        { x: 260, y: 220, r: 7, label: 'EDA Pipeline', desc: 'Statistical outlier and variance distribution analysis.' },
        { x: 380, y: 240, r: 8, label: 'Anomaly Vector', desc: 'Supervised classification for suspicious port sweeps.' },
        { x: 490, y: 210, r: 6, label: 'LLM Orchestrator', desc: 'Structured few-shot prompt chaining.' }
      ];

      let hoveredNode = null;
      let animAngle = 0;

      const drawGraph = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = (hoveredNode === nodes[i] || hoveredNode === nodes[j])
                ? 'rgba(45, 76, 56, 0.65)'
                : 'rgba(203, 216, 207, 0.45)';
              ctx.lineWidth = (hoveredNode === nodes[i] || hoveredNode === nodes[j]) ? 2 : 1;
              ctx.stroke();
            }
          }
        }

        // Draw nodes
        nodes.forEach((n, idx) => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + (hoveredNode === n ? 3 : 0), 0, Math.PI * 2);
          ctx.fillStyle = hoveredNode === n ? '#2d4c38' : '#62826e';
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          // Subtle pulse around active nodes
          if (idx % 2 === 0) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r + 5 + Math.sin(animAngle + idx) * 3, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(98, 130, 110, 0.25)';
            ctx.stroke();
          }
        });

        animAngle += 0.04;
        requestAnimationFrame(drawGraph);
      };

      drawGraph();

      // Mouse Move on Canvas
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;

        hoveredNode = null;
        for (const n of nodes) {
          const dx = mx - n.x;
          const dy = my - n.y;
          if (Math.sqrt(dx * dx + dy * dy) < n.r + 8) {
            hoveredNode = n;
            break;
          }
        }

        if (hoveredNode) {
          const tagEl = document.getElementById('active-node-tag');
          const descEl = document.getElementById('active-node-desc');
          if (tagEl) tagEl.textContent = `ACTIVE NODE: ${hoveredNode.label.toUpperCase()}`;
          if (descEl) descEl.textContent = hoveredNode.desc;
        }
      });

      // Topic Seed Buttons
      document.querySelectorAll('.topic-seed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.topic-seed-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const topic = btn.dataset.topic;
          const targetNode = nodes.find(n => n.label.toLowerCase().includes(topic.slice(0, 4))) || nodes[0];
          hoveredNode = targetNode;
          const tagEl = document.getElementById('active-node-tag');
          const descEl = document.getElementById('active-node-desc');
          if (tagEl) tagEl.textContent = `ACTIVE NODE: ${targetNode.label.toUpperCase()}`;
          if (descEl) descEl.textContent = targetNode.desc;
        });
      });
    }

    // Tab 2: Speed Drill
    const timerEl = document.getElementById('drill-timer');
    const scoreEl = document.getElementById('drill-score');
    const streakEl = document.getElementById('drill-streak');
    const feedbackEl = document.getElementById('drill-feedback');
    let drillInterval = null;
    let drillSeconds = 0;
    let drillAnswered = false;

    const startDrillClock = () => {
      clearInterval(drillInterval);
      drillSeconds = 0;
      drillInterval = setInterval(() => {
        drillSeconds += 0.05;
        if (timerEl) timerEl.textContent = drillSeconds.toFixed(3) + 's';
      }, 50);
    };

    startDrillClock();

    document.querySelectorAll('.drill-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (drillAnswered) return;
        drillAnswered = true;
        clearInterval(drillInterval);

        const isCorrect = btn.dataset.correct === 'true';
        if (isCorrect) {
          btn.classList.add('correct');
          if (scoreEl) scoreEl.textContent = '1,450 PTS (+200)';
          if (streakEl) streakEl.textContent = '4x Multiplier (Peak)';
          if (feedbackEl) feedbackEl.innerHTML = `<span class="text-moss">✓ VALIDATED IN ${drillSeconds.toFixed(3)}s! Constant-time XOR prevents cache timing leaks.</span>`;
          showToast('Drill question solved with sub-millisecond precision!', '⚡');
        } else {
          btn.classList.add('wrong');
          document.querySelector('.drill-opt-btn[data-correct="true"]')?.classList.add('correct');
          if (feedbackEl) feedbackEl.innerHTML = `<span class="text-terracotta">✕ Standard string comparison allows side-channel timing leaks. Option B is correct.</span>`;
        }
      });
    });

    // Tab 3: Radar Chart
    const renderRadarChart = () => {
      const radarCanvas = document.getElementById('avai-radar-canvas');
      if (!radarCanvas) return;
      const ctx = radarCanvas.getContext('2d');
      const w = radarCanvas.width;
      const h = radarCanvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = 110;

      ctx.clearRect(0, 0, w, h);

      const metrics = [
        { label: 'Security', val: 0.96 },
        { label: 'C Logic', val: 0.92 },
        { label: 'Latency', val: 0.98 },
        { label: 'Pipelines', val: 0.90 },
        { label: 'Memory', val: 0.94 }
      ];

      const total = metrics.length;

      // Draw Concentric Rings
      for (let level = 1; level <= 4; level++) {
        ctx.beginPath();
        const curR = (r / 4) * level;
        for (let i = 0; i < total; i++) {
          const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
          const x = cx + curR * Math.cos(angle);
          const y = cy + curR * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(203, 216, 207, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw Spokes
      for (let i = 0; i < total; i++) {
        const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        ctx.strokeStyle = 'rgba(203, 216, 207, 0.7)';
        ctx.stroke();
      }

      // Draw Mastery Polygon
      ctx.beginPath();
      for (let i = 0; i < total; i++) {
        const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
        const curR = r * metrics[i].val;
        const x = cx + curR * Math.cos(angle);
        const y = cy + curR * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(45, 76, 56, 0.28)';
      ctx.fill();
      ctx.strokeStyle = '#2d4c38';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Vertex dots
      for (let i = 0; i < total; i++) {
        const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
        const curR = r * metrics[i].val;
        ctx.beginPath();
        ctx.arc(cx + curR * Math.cos(angle), cy + curR * Math.sin(angle), 4, 0, Math.PI * 2);
        ctx.fillStyle = '#c86a4b';
        ctx.fill();
      }
    };
  };

  // ---------------------------------------------------------------------------
  // 15. BOTANICAL FIELD TERMINAL & INTERACTIVE CLI
  // ---------------------------------------------------------------------------
  const initBotanicalTerminal = () => {
    const termInput = document.getElementById('botanical-terminal-input');
    const termOutput = document.getElementById('botanical-terminal-output');
    const termBody = document.getElementById('botanical-terminal-body');
    const termForm = document.getElementById('botanical-terminal-form');
    const cmdChips = document.querySelectorAll('.term-cmd-chip');

    if (!termInput || !termOutput) return;

    const commandHistory = [];
    let historyIndex = -1;

    const commands = {
      help: () => `
        <div class="term-line text-moss font-bold">AVAILABLE COMMANDS:</div>
        <div class="term-line">&nbsp;&nbsp;<span class="text-terracotta">about</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Philosophy, reverence (Śraddhā) & first principles</div>
        <div class="term-line">&nbsp;&nbsp;<span class="text-terracotta">academics</span>&nbsp;&nbsp;&nbsp;- Top honors at Bishnupur SKV, Radhamohanpur VHS & FIEM MAKAUT</div>
        <div class="term-line">&nbsp;&nbsp;<span class="text-terracotta">certs</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- List 12 verified credentials & achievements</div>
        <div class="term-line">&nbsp;&nbsp;<span class="text-terracotta">skills</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Core disciplines: Cybersecurity, Python/C, AI & Web</div>
        <div class="term-line">&nbsp;&nbsp;<span class="text-terracotta">projects</span>&nbsp;&nbsp;&nbsp;&nbsp;- Flagship builds (AVAI, SentinelShield, Constant-Time Lab)</div>
        <div class="term-line">&nbsp;&nbsp;<span class="text-terracotta">quotes</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Wisdom from Newton, Gates, Hawking, Gandhi, Musk</div>
        <div class="term-line">&nbsp;&nbsp;<span class="text-terracotta">avai</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Architecture notes on AVAI Preparation cognitive engine</div>
        <div class="term-line">&nbsp;&nbsp;<span class="text-terracotta">status</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Live lab telemetry, coordinates, and development environment</div>
        <div class="term-line">&nbsp;&nbsp;<span class="text-terracotta">admin</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Prompt for curator PIN to unlock portfolio edit privileges</div>
        <div class="term-line">&nbsp;&nbsp;<span class="text-terracotta">contact</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Display email & social dispatch channels</div>
        <div class="term-line">&nbsp;&nbsp;<span class="text-terracotta">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear the field terminal display</div>
      `,
      about: () => `
        <div class="term-line text-moss font-bold">ABOUT BIBEK BANDHU NAYEK:</div>
        <div class="term-line">B.Tech undergraduate in Computer Science & Engineering at Future Institute of Engineering and Management (FIEM), affiliated under MAKAUT.</div>
        <div class="term-line">Rooted in Debra, Paschim Medinipur. Dedicated to foundational sciences, zero-trust cybersecurity, and mathematical precision.</div>
      `,
      academics: () => `
        <div class="term-line text-moss font-bold">ACADEMIC HONORS & DISTINCTIONS:</div>
        <div class="term-line">1. <span class="text-terracotta">Secondary 2024</span>: Bishnupur Sri Ramkrishna Vidyayatan &bull; <strong>Roll Number 1 Topper</strong></div>
        <div class="term-line">2. <span class="text-terracotta">Higher Secondary 2026</span>: Radhamohanpur Vivekananda High School &bull; <strong>School Rank 1 & Block Top 5</strong> (PCMB Pure Science)</div>
        <div class="term-line">3. <span class="text-terracotta">Undergraduate 2024–2028</span>: FIEM Sonarpur, Kolkata &bull; <strong>B.Tech CSE</strong> (MAKAUT)</div>
      `,
      certs: () => {
        const certs = getCertificates();
        let html = `<div class="term-line text-moss font-bold">VERIFIED ACCREDITATIONS (${certs.length}):</div>`;
        certs.forEach((c, idx) => {
          html += `<div class="term-line">${idx + 1}. [${c.category.toUpperCase()}] <strong>${escapeHtml(c.title)}</strong> — ${escapeHtml(c.issuer)} (${c.date})</div>`;
        });
        return html;
      },
      skills: () => `
        <div class="term-line text-moss font-bold">BOTANICAL COMPETENCIES:</div>
        <div class="term-line">&bull; <strong>Security & Systems:</strong> Wireshark, Nmap, Linux Hardening, HMAC-SHA256, Raw Sockets</div>
        <div class="term-line">&bull; <strong>Data Science:</strong> Python 3, NumPy, Pandas, Scikit-Learn, Statistical Testing, PCMB Math</div>
        <div class="term-line">&bull; <strong>AI Innovation:</strong> Bayesian Knowledge Tracing, 200 FPS Telemetry, Gemini API, AI Ethics</div>
        <div class="term-line">&bull; <strong>Core Web:</strong> C Systems, Data Structures, Algorithms, Semantic HTML5, Vanilla CSS3, ES6+ JS</div>
      `,
      projects: () => `
        <div class="term-line text-moss font-bold">FEATURED CULTIVATED WORKS:</div>
        <div class="term-line">&bull; <strong>AVAI Preparation:</strong> 100% Free Autonomous Vision & AI-driven adaptive exam engine (200 FPS).</div>
        <div class="term-line">&bull; <strong>SentinelShield:</strong> Socket sniffer and anomaly detector mitigating port sweeps & ARP spoofing.</div>
        <div class="term-line">&bull; <strong>Constant-Time Cryptography:</strong> Mitigation of side-channel attacks via bitwise fixed-time verification.</div>
        <div class="term-line">&bull; <strong>EDA Pipeline:</strong> Automated outlier detection & statistical regression generator in Python.</div>
      `,
      quotes: () => {
        const q = WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)];
        return `<div class="term-line font-serif" style="font-size: 1.05rem; color: #a4beae;">${q.quote}</div><div class="term-line text-terracotta font-mono">— ${q.author} (${q.title})</div>`;
      },
      avai: () => `
        <div class="term-line text-moss font-bold">AVAI PREPARATION LAB NOTES:</div>
        <div class="term-line">Architecture: Pure Client-Side Zero-Dependency Engine &bull; Sub-8.5ms Latency Clocks.</div>
        <div class="term-line">Repository: <a href="https://github.com/nayekdhananjoy1973-lab/avai_preparation" target="_blank" style="color: #68d391; text-decoration: underline;">github.com/nayekdhananjoy1973-lab/avai_preparation</a></div>
      `,
      status: () => `
        <div class="term-line text-moss font-bold">LIVE TELEMETRY:</div>
        <div class="term-line">Location: Sonarpur Station Road, Kolkata Metro &bull; Debra, Paschim Medinipur</div>
        <div class="term-line">Lab: Active in FIEM Department of Computer Science & Engineering</div>
        <div class="term-line">Environment: Ubuntu / Arch Linux &bull; Neovim &bull; VS Code &bull; C & Python 3</div>
      `,
      admin: () => {
        setTimeout(openPasscodeModal, 200);
        return `<div class="term-line text-moss">✓ Opening curator passcode authentication dialog... Default PIN is 2026.</div>`;
      },
      sudo: () => {
        setTimeout(openPasscodeModal, 200);
        return `<div class="term-line text-moss">✓ Elevated privileges requested. Unlocking curator dialog...</div>`;
      },
      contact: () => `
        <div class="term-line text-moss font-bold">DIRECT DISPATCH CHANNELS:</div>
        <div class="term-line">Email: <a href="mailto:bibekbandhu1001@gmail.com" style="color: #68d391;">bibekbandhu1001@gmail.com</a></div>
        <div class="term-line">GitHub: <a href="https://github.com/bibekgit2007" target="_blank" style="color: #68d391;">github.com/bibekgit2007</a></div>
        <div class="term-line">Twitter/X: <a href="https://x.com/Bibektwtx" target="_blank" style="color: #68d391;">@Bibektwtx</a></div>
        <div class="term-line">Facebook: <a href="https://www.facebook.com/search/top?q=Bibek%20Bandhu%20Nayek" target="_blank" style="color: #68d391;">Bibek Bandhu Nayek</a></div>
        <div class="term-line">Instagram: <a href="https://instagram.com/bibekbandhu19" target="_blank" style="color: #68d391;">@bibekbandhu19</a></div>
      `,
      clear: () => {
        termOutput.innerHTML = '';
        return null;
      }
    };

    const executeCmd = (raw) => {
      const trimmed = raw.trim().toLowerCase();
      if (!trimmed) return;

      commandHistory.push(raw);
      historyIndex = commandHistory.length;

      const echo = document.createElement('div');
      echo.className = 'term-line';
      echo.innerHTML = `<span class="text-moss">bibek@flora-fiem:~$</span> <span style="color: #ffffff;">${escapeHtml(raw)}</span>`;
      termOutput.appendChild(echo);

      if (commands[trimmed]) {
        const res = commands[trimmed]();
        if (res) {
          const resDiv = document.createElement('div');
          resDiv.innerHTML = res;
          termOutput.appendChild(resDiv);
        }
      } else {
        const err = document.createElement('div');
        err.className = 'term-line';
        err.innerHTML = `<span class="text-terracotta">Command not found: "${escapeHtml(trimmed)}". Type <strong style="color: #68d391;">help</strong> to inspect valid dispatches.</span>`;
        termOutput.appendChild(err);
      }

      if (termBody) termBody.scrollTop = termBody.scrollHeight;
    };

    termForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      executeCmd(termInput.value);
      termInput.value = '';
    });

    termInput?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          termInput.value = commandHistory[historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          termInput.value = commandHistory[historyIndex] || '';
        } else {
          historyIndex = commandHistory.length;
          termInput.value = '';
        }
      }
    });

    cmdChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.dataset.cmd;
        termInput.value = cmd;
        executeCmd(cmd);
        termInput.value = '';
      });
    });
  };

  // ---------------------------------------------------------------------------
  // 16. WEB AUDIO ACOUSTIC FEEDBACK CLICKS
  // ---------------------------------------------------------------------------
  let soundEnabled = true;
  const initNatureSoundEngine = () => {
    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioIcon = document.getElementById('audio-icon');

    let audioCtx = null;

    const playClickTone = (freq = 480) => {
      if (!soundEnabled) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
      } catch (e) {
        // Audio API not permitted or silent
      }
    };

    audioBtn?.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (audioIcon) audioIcon.textContent = soundEnabled ? '🔊' : '🔇';
      showToast(soundEnabled ? 'Acoustic audio clicks enabled' : 'Audio clicks muted', '🔊');
    });

    document.querySelectorAll('button, .filter-pill, .nav-item, .hobby-badge').forEach(el => {
      el.addEventListener('click', () => playClickTone(520));
    });
  };

  // ---------------------------------------------------------------------------
  // 17. CONTACT FIELD NOTE FORM
  // ---------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-note-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('note-name')?.value.trim();
    showToast(`Thank you, ${name}! Your field note has been dispatched.`, '✉️');
    contactForm.reset();
  });

  // ---------------------------------------------------------------------------
  // 18. MOBILE MENU DRAWER
  // ---------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  mobileToggle?.addEventListener('click', () => {
    const isOpen = mobileDrawer?.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer?.classList.remove('open');
      mobileToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------------------------------------------------------------------------
  // 19. ESCAPE HTML HELPER
  // ---------------------------------------------------------------------------
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------------------------------------------------------------------------
  // 21. PUBLISHED PORTFOLIO DATA INITIALIZER (Loads from data/portfolio-data.json)
  // ---------------------------------------------------------------------------
  const initPublishedPortfolioData = async () => {
    try {
      const res = await fetch('data/portfolio-data.json?v=' + Date.now());
      if (!res.ok) return;
      const data = await res.json();

      // Synchronize certificates
      if (Array.isArray(data.certificates) && data.certificates.length > 0) {
        data.certificates.forEach(pubCert => {
          const idx = DEFAULT_CERTIFICATES.findIndex(c => c.id === pubCert.id);
          if (idx !== -1) {
            DEFAULT_CERTIFICATES[idx] = pubCert;
          } else if (!DELETED_CERTIFICATE_IDS.includes(pubCert.id)) {
            DEFAULT_CERTIFICATES.push(pubCert);
          }
        });
        renderCertificates();
      }

      // Synchronize hero
      if (data.hero) {
        if (data.hero.kicker) {
          const pill = document.querySelector('.botanical-pill .pill-text');
          if (pill) pill.textContent = data.hero.kicker;
        }
        if (data.hero.name && heroHeadingDisplay) {
          heroHeadingDisplay.textContent = data.hero.name;
        }
        if (data.hero.tagline && heroTaglineDisplay) {
          heroTaglineDisplay.innerHTML = data.hero.tagline;
        }
        if (data.hero.quote && heroQuoteDisplay) {
          heroQuoteDisplay.textContent = data.hero.quote;
        }
      }
    } catch (e) {
      // Offline or local bundled fallback
    }
  };

  // ---------------------------------------------------------------------------
  // 22. INITIALIZE ALL ENGINES
  // ---------------------------------------------------------------------------
  updateAdminModeUI();
  initProfilePhoto();
  initJourneyNarrative();
  initSectionContent();
  renderCertificates();
  initLiveIstClock();
  initWisdomReadingRoom();
  initGitHubActivityHeatmap();
  initAvaiSimulatorEngine();
  initBotanicalTerminal();
  initNatureSoundEngine();
  initPublishedPortfolioData();

});

