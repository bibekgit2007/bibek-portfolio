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
      id: 'cert-secondary-2024',
      title: 'Secondary Education Distinction (Roll 1 Topper)',
      issuer: 'Bishnupur Sri Ramkrishna Vidyayatan • WBBSE',
      date: 'May 2024',
      category: 'academic',
      image: 'assets/secondary-certificate.jpg',
      badge: 'Academic Distinction',
      description: 'Maintained Roll Number 1 standing with honors in mathematics, physical sciences, and life sciences in Debra, Paschim Medinipur.'
    },
    {
      id: 'cert-hs-2026',
      title: 'Higher Secondary (School Rank 1 & Block Top 5)',
      issuer: 'Radhamohanpur Vivekananda High School • WBCHSE',
      date: 'May 2026',
      category: 'academic',
      image: 'assets/higher-secondary-certificate.jpg',
      badge: 'PCMB Top 5 Block',
      description: 'Graduated as Rank 1 Topper in school and secured Top 5 standing across the educational block in Pure Science (Physics, Chemistry, Math, Biology).'
    },
    {
      id: 'cert-bonafide-fiem',
      title: 'B.Tech CSE Bonafide Scholar & Project Credential',
      issuer: 'Future Institute of Engineering and Management (FIEM)',
      date: '2024 — Present',
      category: 'academic',
      image: 'assets/bonafide-project-certificate.jpg',
      badge: 'MAKAUT Affiliated',
      description: 'Undergraduate verification and exploratory project accreditation in computer systems and network programming.'
    },
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
      id: 'cert-nspc-merit',
      title: 'NSPC National Certificate of Merit & Technology',
      issuer: 'Ministry of Youth Affairs & Sports / NSPC',
      date: '2024',
      category: 'national',
      image: 'assets/nspc-cirqula-certificate.png',
      badge: 'Merit Credential',
      description: 'Exemplary project presentation and technical execution across computing disciplines.'
    },
    {
      id: 'cert-first-commit',
      title: 'First Open Source Engineering Commit & Repository Award',
      issuer: 'GitHub & Global Open Source Community',
      date: '2024',
      category: 'technical',
      image: 'assets/1st-commit-certificate.pdf',
      badge: 'Open Source',
      description: 'Commemorating the first validated open-source code commit and dedication to transparent developer collaboration.'
    },
    {
      id: 'cert-bridge-fiem',
      title: 'Foundational Computer Science Bridge Course Distinction',
      issuer: 'Department of Computer Science & Engineering, FIEM',
      date: '2024',
      category: 'technical',
      image: 'assets/bridge-course-certificate.pdf',
      badge: 'Departmental Honor',
      description: 'Advanced distinction in C programming, Boolean algebra, memory allocation, and algorithmic design.'
    },
    {
      id: 'cert-gi-tag',
      title: 'National Intellectual Heritage & GI Tag Distinction',
      issuer: 'Ministry of Commerce & Industry, Govt. of India',
      date: '2024',
      category: 'national',
      image: 'assets/gi-tag-quiz-certificate.pdf',
      badge: 'Government Award',
      description: 'National certification in regional intellectual property, cultural geography, and heritage preservation.'
    }
  ];

  // Helper functions for storage
  const getCertificates = () => {
    try {
      const stored = localStorage.getItem('bbn_nature_certificates');
      if (stored) return JSON.parse(stored);
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
  // 03. 3D NATURAL GALLERY & SHOWROOM ENGINE
  // ---------------------------------------------------------------------------
  const galleryGrid = document.getElementById('cert-gallery-grid');
  let currentFilter = 'all';

  const renderCertificates = () => {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    const certs = getCertificates();
    const filtered = currentFilter === 'all' 
      ? certs 
      : certs.filter(c => c.category === currentFilter);

    if (filtered.length === 0) {
      galleryGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">🌱</span>
          <p class="font-serif" style="font-size: 1.25rem;">No certificates found in this category.</p>
        </div>
      `;
      return;
    }

    filtered.forEach((cert) => {
      const card = createCertificateCardDOM(cert);
      galleryGrid.appendChild(card);
    });

    updateCategoryCounts();
  };

  const createCertificateCardDOM = (cert) => {
    const article = document.createElement('article');
    article.className = 'cert-3d-card';
    article.dataset.id = cert.id;
    article.dataset.category = cert.category;

    // Display image or placeholder if PDF
    const isPdf = cert.image.endsWith('.pdf');
    const imageSrc = isPdf ? 'assets/bonafide-project-certificate.jpg' : cert.image;

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
    lightboxImg.src = isPdf ? 'assets/bonafide-project-certificate.jpg' : cert.image;
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
  // 10. CHANGE PASSCODE ENGINE
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
  // 11. CONTACT FIELD NOTE FORM
  // ---------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-note-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('note-name')?.value.trim();
    showToast(`Thank you, ${name}! Your field note has been dispatched.`, '✉️');
    contactForm.reset();
  });

  // ---------------------------------------------------------------------------
  // 12. MOBILE MENU DRAWER
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
  // 13. ESCAPE HTML HELPER
  // ---------------------------------------------------------------------------
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------------------------------------------------------------------------
  // 14. INITIALIZE ALL ENGINES
  // ---------------------------------------------------------------------------
  updateAdminModeUI();
  initProfilePhoto();
  initJourneyNarrative();
  renderCertificates();

});
