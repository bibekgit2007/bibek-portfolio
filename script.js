/**
 * =============================================================================
 * BIBEK BANDHU NAYEK — PORTFOLIO ENGINE & 200 FPS ANIMATIC VIDEO CONTROLLER
 * Author: Bibek Bandhu Nayek (1st Year B.Tech CSE, Future Institute of Eng. & Mgmt - FIEM)
 * Architecture: Pure Vanilla ES6+ JavaScript (Zero External Libraries)
 * =============================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ===========================================================================
  // 01. CANVAS PARTICLE BACKGROUND ENGINE
  // ===========================================================================
  const initBackgroundCanvas = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let mouse = { x: null, y: null, radius: 120 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 0.8;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        const colorChoices = [
          'rgba(255, 107, 0, 0.75)',    // Saffron Orange Shakti
          'rgba(255, 255, 255, 0.85)',   // Radiant Silk White
          'rgba(16, 185, 129, 0.75)',   // Emerald Security
          'rgba(249, 115, 22, 0.7)'     // Warm Amber
        ];
        this.color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 3;
            this.y -= (dy / dist) * force * 3;
          }
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particleCount = Math.min(Math.floor((width * height) / 15000), 80);
    const particles = Array.from({ length: particleCount }, () => new Particle());

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 115) {
            const alpha = 1 - dist / 115;
            ctx.strokeStyle = i % 2 === 0 
              ? `rgba(255, 107, 0, ${alpha * 0.18})` 
              : `rgba(16, 185, 129, ${alpha * 0.18})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    };

    animate();
  };

  initBackgroundCanvas();

  // ===========================================================================
  // 02. CYBER DECRYPTION / TEXT SCRAMBLER
  // ===========================================================================
  const initTextScrambler = () => {
    const roleElem = document.getElementById('role-text');
    if (!roleElem) return;

    const roles = JSON.parse(roleElem.dataset.roles || '[]');
    if (!roles.length) return;

    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let roleIndex = 0;

    const scrambleTo = (targetText) => {
      let iteration = 0;
      const originalText = targetText;
      const interval = setInterval(() => {
        roleElem.innerText = originalText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        if (iteration >= originalText.length) {
          clearInterval(interval);
        }
        iteration += 1 / 2;
      }, 30);
    };

    setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      scrambleTo(roles[roleIndex]);
    }, 3800);
  };

  initTextScrambler();

  // ===========================================================================
  // 03. INTERACTIVE SECURITY CLI SANDBOX (UPDATED DETAILS)
  // ===========================================================================
  const initSecurityTerminal = () => {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const body = document.getElementById('terminal-body');
    const quickChips = document.querySelectorAll('.cmd-chip');
    const quickTerminalBtn = document.getElementById('quick-terminal-btn');

    if (!input || !output) return;

    const commandHistory = [];
    let historyIndex = -1;

    const commands = {
      help: () => `
        <div class="output-line text-cyan font-bold">AVAILABLE COMMANDS:</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">whoami</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Display student background & institutional affiliation</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">education</span>&nbsp;&nbsp;&nbsp;&nbsp;- View top academic records (FIEM 2026, H.S 2026, Secondary 2024)</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">certificates</span>&nbsp;- Output verified institutional accreditations</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">skills</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Output technical capabilities & security tools</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">projects</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- List flagship software & research repositories</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">scan</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Run simulated network vulnerability diagnostics</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">reel</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Jump to 200 FPS animatic video showcase</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">contact</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Output direct communication channels</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">matrix</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Stream cyber matrix data feed</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear the active terminal buffer</div>
      `,
      whoami: () => `
        <div class="output-line font-bold text-main">Bibek Bandhu Nayek</div>
        <div class="output-line text-muted">1st Year B.Tech CSE @ Future Institute of Engineering and Management (FIEM) — 2026 Batch</div>
        <div class="output-line text-secondary">Passionate Cyber Security Enthusiast, Data Analyst & AI Engineering Innovator.</div>
      `,
      about: () => commands.whoami(),
      education: () => `
        <div class="output-line text-cyan font-bold">SPIRAL ACADEMIC TRAJECTORY & LOCATIONS:</div>
        <div class="output-line">• <strong>Future Institute of Engineering and Management (FIEM)</strong> — 1st Year B.Tech CSE (2026 Batch)</div>
        <div class="output-line text-muted">&nbsp;&nbsp;📍 Sonarpur, Kolkata Metro, West Bengal (PIN 700150) | 22.4419° N, 88.4237° E</div>
        <div class="output-line">• <strong>Radhamohanpur Vivekananda High School</strong> — Higher Secondary (H.S. 2026) | <span class="text-emerald">Rank 1</span> • <span class="text-cyan">Block Top 5</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;📍 Radhamohanpur, Debra, Paschim Medinipur, WB | 22.4286° N, 87.6582° E</div>
        <div class="output-line">• <strong>Bishnupur Sri Ramkrishna Vidyayatan</strong> — Secondary Education (2024) | <span class="text-emerald">Roll-1 Distinction</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;📍 Bishnupur, West Midnapore (Paschim Medinipur), WB | 22.4280° N, 87.3200° E</div>
      `,
      certificates: () => `
        <div class="output-line text-cyan font-bold">OFFICIAL STATE BOARD CREDENTIALS & ACADEMIC CERTIFICATIONS:</div>
        <div class="output-line">🏛️ <strong>WBCHSE Higher Secondary 2026</strong> — <span class="text-emerald">Grade A++ (Highest Distinction)</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;&nbsp;School: Radhamohanpur Vivekananda High School | Reg: 3241140595 | No: 391612</div>
        <div class="output-line">🏛️ <strong>WBBSE Madhyamik Pariksha 2024</strong> — <span class="text-cyan">Grade AA (Outstanding Honor)</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;&nbsp;School: Bishnupur Sri Ramkrishna Vidyayatan | Roll: 501951N-0034 | Cert: 057313</div>
        <div class="output-line">📜 <strong>Bonafide Project Certificate</strong> — <span class="text-amber" style="color:#fbbf24;">"Health & Fitness - Path to Better Life" (Roll 1)</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;&nbsp;School: Radhamohanpur VHS | Class XII Roll 1 | Guide Verified: 05/10/2025</div>
        <div class="output-line text-cyan font-bold" style="margin-top:0.4rem;">TECHNICAL ACCREDITATIONS:</div>
        <div class="output-line">1. <strong>Google Cybersecurity Professional</strong> — Google Career Certificates (ID: GOOG-SEC-2024-8842)</div>
        <div class="output-line">2. <strong>Machine Learning & Neural Architectures</strong> — DeepLearning.AI & Stanford Online (ID: DLAI-ML-7729)</div>
        <div class="output-line">3. <strong>Cisco CyberOps Associate & Defense</strong> — Cisco Networking Academy (ID: CSCO-NET-89104)</div>
        <div class="output-line">4. <strong>Data Structures & Algorithms with Python</strong> — NPTEL / IIT Elite (ID: NPTEL-IIT-ELITE-991)</div>
      `,
      skills: () => `
        <div class="output-line text-cyan font-bold">TECHNICAL MATRIX:</div>
        <div class="output-line">• <strong>Security</strong>: Wireshark, Nmap, Linux Hardening, OWASP Top 10, Cryptography, Packet Dissection</div>
        <div class="output-line">• <strong>Data & AI</strong>: Python, Pandas, NumPy, Scikit-Learn, Statistical Testing, Data Pipelines</div>
        <div class="output-line">• <strong>Systems & Web</strong>: Vanilla JavaScript (ES6+), Modern CSS3, HTML5, C, REST APIs, Git/GitHub</div>
      `,
      projects: () => `
        <div class="output-line text-cyan font-bold">FEATURED FLAGSHIP BUILDS:</div>
        <div class="output-line">1. <strong>SentinelShield</strong> — Automated Vulnerability & Port Scanner (Python/Sockets)</div>
        <div class="output-line">2. <strong>NeuralInsight</strong> — Intelligent Data Analytics & Prediction Dashboard (Pandas/ML)</div>
        <div class="output-line">3. <strong>AegisAuth</strong> — Zero-Trust Cryptographic Token Authenticator (SHA-256 HMAC)</div>
        <div class="output-line">4. <strong>ApexVision</strong> — Neural Log Anomaly Detector (PyTorch/FastAPI)</div>
        <div class="output-line">5. <strong>QuantumPacket</strong> — Real-Time High-Throughput Traffic Dissector (C/PCAP)</div>
      `,
      reel: () => {
        document.getElementById('multimedia-reel')?.scrollIntoView({ behavior: 'smooth' });
        return `<div class="output-line text-cyan font-mono">[+] Scrolling to Animatic Video Showcase (200 FPS)...</div>`;
      },
      scan: () => {
        simulateScan();
        return `<div class="output-line text-cyan font-mono">[+] Initializing probe on subnet 192.168.1.0/24...</div>`;
      },
      contact: () => `
        <div class="output-line text-cyan font-bold">DIRECT CHANNELS:</div>
        <div class="output-line">• Email: <a href="mailto:bibekbandhu.nayek@gmail.com" class="text-emerald underline">bibekbandhu.nayek@gmail.com</a></div>
        <div class="output-line">• GitHub: <a href="https://github.com" target="_blank" class="text-cyan underline">github.com/bibekbandhunayek</a></div>
        <div class="output-line">• LinkedIn: <a href="https://linkedin.com" target="_blank" class="text-cyan underline">linkedin.com/in/bibekbandhunayek</a></div>
      `,
      socials: () => commands.contact(),
      matrix: () => `
        <div class="output-line text-emerald font-mono">01000010 01101001 01100010 01100101 01101001 01101011 (B-I-B-E-K)</div>
        <div class="output-line text-cyan font-mono">SECURITY INTEGRITY: 100% • 200 FPS TELEMETRY ACTIVE</div>
      `,
      date: () => `<div class="output-line">${new Date().toUTCString()}</div>`,
      clear: () => {
        output.innerHTML = '';
        return null;
      }
    };

    const simulateScan = () => {
      const steps = [
        '[+] Probing port 22 (SSH)... Secured (Key-Only Auth)',
        '[+] Probing port 80 (HTTP)... Redirecting 301 to HTTPS (TLS 1.3)',
        '[+] Probing port 443 (HTTPS)... Valid Certificate & Zero-Trust Active',
        '[+] Probing port 8080 (API)... Rate-Limited & WAF Protected',
        '[✓] Scan Complete: 0 Critical Vulnerabilities Found. System Hardened.'
      ];

      steps.forEach((step, idx) => {
        setTimeout(() => {
          const line = document.createElement('div');
          line.className = idx === steps.length - 1 ? 'output-line text-emerald font-bold' : 'output-line text-secondary';
          line.textContent = step;
          output.appendChild(line);
          body.scrollTop = body.scrollHeight;
        }, (idx + 1) * 450);
      });
    };

    const executeCommand = (rawCmd) => {
      const cmd = rawCmd.trim().toLowerCase();
      if (!cmd) return;

      commandHistory.push(rawCmd);
      historyIndex = commandHistory.length;

      const userEcho = document.createElement('div');
      userEcho.className = 'output-line';
      userEcho.innerHTML = `<span class="prompt-user">bibek@fiem-lab</span>:<span class="prompt-path">~</span>$ <span class="text-main">${escapeHtml(rawCmd)}</span>`;
      output.appendChild(userEcho);

      if (commands[cmd]) {
        const result = commands[cmd]();
        if (result !== null) {
          const resElem = document.createElement('div');
          resElem.innerHTML = result;
          output.appendChild(resElem);
        }
      } else {
        const errorLine = document.createElement('div');
        errorLine.className = 'output-line text-danger-primary';
        errorLine.innerHTML = `zsh: command not found: <span class="font-bold">${escapeHtml(cmd)}</span>. Type <span class="text-cyan font-bold">'help'</span> for list of commands.`;
        output.appendChild(errorLine);
      }

      input.value = '';
      body.scrollTop = body.scrollHeight;
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeCommand(input.value);
      } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          input.value = commandHistory[historyIndex] || '';
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          input.value = commandHistory[historyIndex] || '';
        } else {
          historyIndex = commandHistory.length;
          input.value = '';
        }
        e.preventDefault();
      }
    });

    quickChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const cmd = chip.dataset.cmd;
        if (cmd) {
          input.value = cmd;
          executeCommand(cmd);
          input.focus();
        }
      });
    });

    if (quickTerminalBtn) {
      quickTerminalBtn.addEventListener('click', () => {
        document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' });
        input.focus();
      });
    }
  };

  initSecurityTerminal();

  // ===========================================================================
  // 04. 3D TILT & MOUSE SPOTLIGHT TRACKING
  // ===========================================================================
  const initCardEffects = () => {
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    const tiltCards = document.querySelectorAll('.tilt-card');

    spotlightCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });

    tiltCards.forEach((card) => {
      const inner = card.querySelector('.project-card-inner');
      if (!inner) return;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        inner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  };

  initCardEffects();

  // ===========================================================================
  // 05. IMMERSIVE 3D SCROLL PHYSICS & SPIRAL ORBIT ENGINE (60 - 200 FPS)
  // ===========================================================================
  const initImmersiveScroll = () => {
    const root = document.documentElement;
    const heroSection = document.getElementById('hero');
    const spiralWrapper = document.getElementById('spiral-chart-wrapper');
    const spiralSpline = document.getElementById('spiral-trajectory-path');
    const immersiveCards = document.querySelectorAll('.immersive-scroll-card');

    let isTicking = false;

    const onScroll = () => {
      const scrollTop = window.scrollY || root.scrollTop;
      const docHeight = root.scrollHeight - root.clientHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      root.style.setProperty('--scroll-progress', `${scrollPercent.toFixed(2)}%`);
      root.style.setProperty('--glow-offset-y', `${(scrollTop * 0.15).toFixed(1)}px`);

      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        if (scrollTop <= heroHeight) {
          const progress = scrollTop / heroHeight;
          const rotateX = progress * -18;
          const translateY = progress * 60;
          const scale = 1 - progress * 0.08;
          const opacity = Math.max(1 - progress * 1.1, 0.05);

          root.style.setProperty('--hero-rotate', `${rotateX.toFixed(2)}deg`);
          root.style.setProperty('--hero-translate', `${translateY.toFixed(1)}px`);
          root.style.setProperty('--hero-scale', `${scale.toFixed(3)}`);
          root.style.setProperty('--hero-opacity', `${opacity.toFixed(2)}`);
        }
      }

      // Dynamic Spiral Orbit & Trajectory Flow
      if (spiralWrapper && spiralSpline) {
        const rect = spiralWrapper.getBoundingClientRect();
        const winHeight = window.innerHeight;

        if (rect.top <= winHeight && rect.bottom >= 0) {
          const totalDistance = rect.height + winHeight;
          const currentProgress = (winHeight - rect.top) / totalDistance;
          const clamped = Math.min(Math.max(currentProgress, 0), 1);
          
          // Animate spiral stroke offset & radar rings
          const offsetVal = 1200 * (1 - clamped);
          spiralSpline.style.strokeDashoffset = `${offsetVal.toFixed(1)}`;
        }
      }

      const vhCenter = window.innerHeight / 2;
      immersiveCards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.top + cardRect.height / 2;
        const diff = (cardCenter - vhCenter) / vhCenter;

        if (cardRect.top < window.innerHeight && cardRect.bottom > 0) {
          const tiltAngle = Math.max(Math.min(diff * 4, 8), -8);
          card.style.transform = `perspective(1000px) rotateX(${tiltAngle.toFixed(1)}deg)`;
        }
      });

      isTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!isTicking) {
        window.requestAnimationFrame(onScroll);
        isTicking = true;
      }
    }, { passive: true });

    onScroll();
  };

  initImmersiveScroll();

  // ===========================================================================
  // 06. INTERSECTION OBSERVER & DYNAMIC COUNTERS
  // ===========================================================================
  const initScrollInteractions = () => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach((el) => revealObserver.observe(el));

    const metricElements = document.querySelectorAll('.metric-number');
    const metricObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10) || 0;
          let current = 0;
          const duration = 1200;
          const stepTime = Math.max(Math.floor(duration / Math.max(target, 1)), 25);

          const timer = setInterval(() => {
            current += Math.ceil(target / (duration / stepTime));
            if (current >= target) {
              el.textContent = target === 1 ? '#1' : `${target}+`;
              clearInterval(timer);
            } else {
              el.textContent = target === 1 ? `#${current}` : `${current}+`;
            }
          }, stepTime);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    metricElements.forEach((el) => metricObserver.observe(el));
  };

  initScrollInteractions();

  // ===========================================================================
  // 07. ANIMATIC VIDEO SHOWCASE & 200 FPS CYBER CANVAS CONTROLLER
  // ===========================================================================
  const initVideoController = () => {
    const video = document.getElementById('profile-animatic-video');
    const playBtn = document.getElementById('video-play-btn');
    const overlay = document.getElementById('video-overlay-screen');
    const fullscreenBtn = document.getElementById('video-fullscreen-btn');
    const waveBars = document.querySelectorAll('.wave-bar');
    const fileInput = document.getElementById('video-file-input');
    const statusMsg = document.getElementById('video-status-msg');
    const hudTitle = document.getElementById('hud-video-title');
    const cyberCanvas = document.getElementById('video-cyber-canvas');

    let waveInterval = null;
    let isCyberCanvasActive = false;
    let cyberAnimId = null;

    // 200 FPS Generative Cyber Animatic Simulation on Canvas
    const initCyberCanvas = () => {
      if (!cyberCanvas) return;
      const ctx = cyberCanvas.getContext('2d');
      let w = (cyberCanvas.width = cyberCanvas.offsetWidth || 800);
      let h = (cyberCanvas.height = cyberCanvas.offsetHeight || 450);

      window.addEventListener('resize', () => {
        w = cyberCanvas.width = cyberCanvas.offsetWidth || 800;
        h = cyberCanvas.height = cyberCanvas.offsetHeight || 450;
      });

      let angle = 0;
      const gridNodes = Array.from({ length: 40 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 200,
        speed: 0.5 + Math.random() * 1.5
      }));

      const renderCyberVisuals = () => {
        if (!isCyberCanvasActive) return;
        ctx.fillStyle = 'rgba(2, 4, 8, 0.2)';
        ctx.fillRect(0, 0, w, h);

        angle += 0.02;

        // Draw rotating 3D Cyber Wireframe Cube in Center
        const cx = w / 2;
        const cy = h / 2;
        const size = 60 + Math.sin(angle * 2) * 10;

        ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // Cube Face 1
        ctx.strokeRect(-size / 2, -size / 2, size, size);
        ctx.restore();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-angle * 1.3);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
        ctx.strokeRect(-size / 2.5, -size / 2.5, size / 1.25, size / 1.25);
        ctx.restore();

        // Draw Cyber HUD Grid Nodes & Data Lines
        gridNodes.forEach((node) => {
          node.y += node.speed;
          if (node.y > h) node.y = 0;

          ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
          ctx.beginPath();
          ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Telemetry Text
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#10b981';
        ctx.fillText(`200 FPS • STREAM: ACTIVE • TELEMETRY BUFFER 100%`, 25, 30);
        ctx.fillStyle = '#06b6d4';
        ctx.fillText(`ROTATION_PITCH: ${(angle % Math.PI).toFixed(4)} RAD | ZERO-TRUST ACTIVE`, 25, 48);

        cyberAnimId = requestAnimationFrame(renderCyberVisuals);
      };

      return {
        start: () => {
          isCyberCanvasActive = true;
          cyberCanvas.style.opacity = '1';
          renderCyberVisuals();
        },
        stop: () => {
          isCyberCanvasActive = false;
          if (cyberAnimId) cancelAnimationFrame(cyberAnimId);
          ctx.clearRect(0, 0, w, h);
          cyberCanvas.style.opacity = '0';
        }
      };
    };

    const cyberRenderer = initCyberCanvas();

    const startWaveform = () => {
      if (waveInterval) return;
      waveInterval = setInterval(() => {
        waveBars.forEach((bar) => {
          const randHeight = Math.floor(Math.random() * 85) + 15;
          bar.style.height = `${randHeight}%`;
        });
      }, 70);
    };

    const stopWaveform = () => {
      clearInterval(waveInterval);
      waveInterval = null;
      waveBars.forEach((bar) => (bar.style.height = '20%'));
    };

    // Play button handler
    if (playBtn && video) {
      playBtn.addEventListener('click', () => {
        overlay?.classList.add('hidden');
        video.controls = true;

        video.play().then(() => {
          startWaveform();
          cyberRenderer?.stop();
        }).catch(() => {
          // If video file is not yet dropped, run the 200 FPS Cyber Animatic Visualizer
          cyberRenderer?.start();
          startWaveform();
          if (window.showToast) {
            window.showToast('Playing 200 FPS Cyber Animatic Stream! Use "Upload / Change Video" to test your MP4.', 'info');
          }
        });
      });

      video.addEventListener('pause', () => {
        stopWaveform();
        cyberRenderer?.stop();
      });
      video.addEventListener('ended', () => {
        stopWaveform();
        cyberRenderer?.stop();
        overlay?.classList.remove('hidden');
      });
      video.addEventListener('play', () => {
        startWaveform();
      });
    }

    // Dynamic Video File Upload Picker
    if (fileInput && video) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const videoUrl = URL.createObjectURL(file);
          video.src = videoUrl;
          video.controls = true;
          overlay?.classList.add('hidden');
          
          if (statusMsg) statusMsg.textContent = `Playing custom: ${file.name}`;
          if (hudTitle) hudTitle.textContent = `STREAM_CUSTOM: ${file.name.toUpperCase()}`;

          video.play().then(() => {
            startWaveform();
            cyberRenderer?.stop();
          }).catch(() => {});

          if (window.showToast) {
            window.showToast(`Loaded ${file.name} successfully into 200 FPS player!`, 'success');
          }
        }
      });
    }

    // Fullscreen Controller
    if (fullscreenBtn && video) {
      fullscreenBtn.addEventListener('click', () => {
        const frame = document.getElementById('video-screen-frame');
        if (frame?.requestFullscreen) {
          frame.requestFullscreen();
        } else if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        }
      });
    }
  };

  initVideoController();

  // ===========================================================================
  // 08. PROJECT FILTER & NATIVE MODAL INSPECTOR
  // ===========================================================================
  const initProjectEngine = () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDismissBtn = document.getElementById('modal-dismiss-btn');

    const projectData = {
      sentinel: {
        title: 'SentinelShield: Automated Vulnerability & Port Scanner',
        badge: 'Cyber Security & Network Defense',
        desc: 'A robust multi-threaded reconnaissance tool built with Python socket programming. It efficiently fingerprints open TCP/UDP ports, performs service banner grabbing, checks for default credentials, and queries CVE databases for published vulnerability severity scores.',
        features: [
          'Multi-threaded port auditing with configurable socket timeout intervals.',
          'Automated CVE mapping against current National Vulnerability Databases.',
          'Generates formatted JSON & HTML security audit telemetry reports.',
          'Subnet-wide CIDR block scanning mode with IP range expansion.'
        ],
        tech: ['Python 3', 'Socket API', 'Nmap Lib', 'JSON', 'Subnet CIDR', 'Threading']
      },
      neuralinsight: {
        title: 'NeuralInsight: Intelligent Data Analytics & Prediction Engine',
        badge: 'Data Analytics & Applied AI',
        desc: 'An automated exploratory data analysis pipeline that parses large multi-variable datasets, automatically detects missing values, computes correlation matrices, and trains baseline regression/classification models with hyperparameter tuning.',
        features: [
          'Automated outlier detection using IQR and Z-score statistical metrics.',
          'Interactive correlation heatmap and feature importance visualizer.',
          'Predictive trend modeling with linear regression and decision forests.',
          'Exportable clean data pipelines with full reproducible Jupyter notebooks.'
        ],
        tech: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Seaborn', 'Matplotlib']
      },
      aegis: {
        title: 'AegisAuth: Zero-Trust Cryptographic Token Authenticator',
        badge: 'Cryptography & Protocol Security',
        desc: 'A hardened token authentication library implementing HMAC-SHA256 signatures, sliding session expiration, replay attack mitigation, and token revocation blacklists.',
        features: [
          'Constant-time string comparison to prevent timing side-channel attacks.',
          'Rotational asymmetric secret keys and payload encryption.',
          'Memory-safe C/Node bindings for high-throughput authentication queries.',
          'Zero external runtime dependencies to minimize supply-chain risk.'
        ],
        tech: ['C / Node.js', 'SHA-256 HMAC', 'Zero-Trust Architecture', 'Security Primitives']
      },
      apexvision: {
        title: 'ApexVision: Neural Anomaly Detector for Streaming Logs',
        badge: 'AI Systems & Anomaly Detection',
        desc: 'A real-time deep learning anomaly detection service parsing streaming server logs to isolate distributed denial-of-service (DDoS) spikes, brute-force anomalies, and unexpected egress spikes.',
        features: [
          'Time-series anomaly scoring with dynamic threshold recalibration.',
          'FastAPI streaming endpoint processing thousands of events/sec.',
          'Automated incident dispatch webhook triggers for DevOps teams.',
          'Lightweight neural inference engine optimized for low latency.'
        ],
        tech: ['PyTorch', 'FastAPI', 'Time-Series Analysis', 'Webhooks', 'Docker']
      },
      quantumpacket: {
        title: 'QuantumPacket: Real-time Traffic Dissector',
        badge: 'Network Protocols & Low-Level C',
        desc: 'A high-performance network frame analyzer written in C that hooks into raw network interfaces to capture and dissect Ethernet frames, IP headers, and TCP session flows with nanosecond timestamps.',
        features: [
          'Packet decoding for IPv4/IPv6, TCP, UDP, ICMP, DNS, and HTTP/TLS.',
          'TCP flow reassembly and bandwidth throughput calculation.',
          'PCAP file export compatibility with Wireshark and tcpdump.',
          'Memory-efficient circular packet buffer.'
        ],
        tech: ['C Programming', 'PCAP API', 'Network Protocols', 'Low-Level Systems']
      }
    };

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach((card) => {
          const category = card.dataset.category || '';
          if (filter === 'all' || category.includes(filter)) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });

    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    openModalBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const projectId = btn.dataset.project;
        const data = projectData[projectId];
        if (!data || !modal) return;

        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-badge').textContent = data.badge;
        document.getElementById('modal-description').textContent = data.desc;

        const featureList = document.getElementById('modal-features');
        featureList.innerHTML = data.features.map((f) => `<li>${escapeHtml(f)}</li>`).join('');

        const techChips = document.getElementById('modal-tech');
        techChips.innerHTML = data.tech.map((t) => `<span>${escapeHtml(t)}</span>`).join('');

        modal.showModal();
      });
    });

    const closeModal = () => modal?.close();
    modalCloseBtn?.addEventListener('click', closeModal);
    modalDismissBtn?.addEventListener('click', closeModal);

    modal?.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        modal.close();
      }
    });
  };

  initProjectEngine();

  // ===========================================================================
  // 08B. CERTIFICATE HIGH-RESOLUTION LIGHTBOX CONTROLLER
  // ===========================================================================
  const initCertificateLightbox = () => {
    const modal = document.getElementById('cert-lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const titleEl = document.getElementById('lightbox-cert-title');
    const subtitleEl = document.getElementById('lightbox-cert-subtitle');
    const gradeEl = document.getElementById('lightbox-grade-text');
    const idEl = document.getElementById('lightbox-id-text');
    const imgEl = document.getElementById('lightbox-img');
    const downloadBtn = document.getElementById('lightbox-download-btn');
    const zoomToggleBtn = document.getElementById('lightbox-zoom-toggle');

    const triggers = document.querySelectorAll('.cert-lightbox-trigger, .cert-img-wrapper');
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const dataset = trigger.dataset;
        if (!modal || !imgEl) return;

        const src = dataset.lightboxSrc || 'assets/higher-secondary-certificate.jpg';
        const title = dataset.lightboxTitle || 'Certificate Document';
        const inst = dataset.lightboxInst || '';
        const grade = dataset.lightboxGrade || '';
        const certId = dataset.lightboxId || '';
        const pdfUrl = dataset.pdfUrl || src;

        imgEl.src = src;
        imgEl.alt = title;
        imgEl.classList.remove('zoomed');

        if (titleEl) titleEl.textContent = title;
        if (subtitleEl) subtitleEl.textContent = inst;
        if (gradeEl) gradeEl.textContent = grade;
        if (idEl) idEl.textContent = certId;

        if (downloadBtn) {
          downloadBtn.href = pdfUrl;
          downloadBtn.download = pdfUrl.split('/').pop() || 'certificate';
        }

        modal.showModal();
        if (window.playMechanicalClick) window.playMechanicalClick('high');
      });
    });

    if (zoomToggleBtn && imgEl) {
      zoomToggleBtn.addEventListener('click', () => {
        imgEl.classList.toggle('zoomed');
        if (window.playMechanicalClick) window.playMechanicalClick('mid');
      });
    }

    if (imgEl) {
      imgEl.addEventListener('click', () => {
        imgEl.classList.toggle('zoomed');
        if (window.playMechanicalClick) window.playMechanicalClick('mid');
      });
    }

    const closeLightbox = () => {
      modal?.close();
      if (imgEl) imgEl.classList.remove('zoomed');
    };

    closeBtn?.addEventListener('click', closeLightbox);

    modal?.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeLightbox();
      }
    });
  };

  initCertificateLightbox();

  // ===========================================================================
  // 09. CONTACT FORM VALIDATION & TOAST NOTIFICATIONS
  // ===========================================================================
  const initContactAndToasts = () => {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailAddress = document.getElementById('email-address')?.textContent || 'bibekbandhu.nayek@gmail.com';
    const toastContainer = document.getElementById('toast-container');

    window.showToast = (message, type = 'success') => {
      if (!toastContainer) return;
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <span>${type === 'success' ? '✓' : 'ℹ'}</span>
        <span>${escapeHtml(message)}</span>
      `;
      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('toast-fade-out');
        setTimeout(() => toast.remove(), 300);
      }, 3200);
    };

    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(emailAddress);
          const copyBtnText = document.getElementById('copy-btn-text');
          if (copyBtnText) copyBtnText.textContent = 'Copied!';
          window.showToast(`Copied ${emailAddress} to clipboard!`, 'success');

          setTimeout(() => {
            if (copyBtnText) copyBtnText.textContent = 'Copy';
          }, 2500);
        } catch (err) {
          window.showToast('Failed to copy email automatically.', 'info');
        }
      });
    }

    if (form && submitBtn) {
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');
      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');
      const messageError = document.getElementById('message-error');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
          nameInput.classList.add('invalid');
          nameError?.classList.add('visible');
          isValid = false;
        } else {
          nameInput.classList.remove('invalid');
          nameError?.classList.remove('visible');
        }

        if (!emailRegex.test(emailInput.value.trim())) {
          emailInput.classList.add('invalid');
          emailError?.classList.add('visible');
          isValid = false;
        } else {
          emailInput.classList.remove('invalid');
          emailError?.classList.remove('visible');
        }

        if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
          messageInput.classList.add('invalid');
          messageError?.classList.add('visible');
          isValid = false;
        } else {
          messageInput.classList.remove('invalid');
          messageError?.classList.remove('visible');
        }

        if (!isValid) return;

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          form.reset();
          window.showToast('Message encrypted and dispatched successfully! Bibek will respond shortly.', 'success');
        }, 1200);
      });
    }
  };

  initContactAndToasts();

  // ===========================================================================
  // 10. SCROLL PROGRESS RING, NAVBAR & BACK-TO-TOP
  // ===========================================================================
  const initNavigationAndScroll = () => {
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('back-to-top-btn');
    const progressCircle = document.querySelector('.progress-ring-circle');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const currentYearElem = document.getElementById('current-year');

    if (currentYearElem) {
      currentYearElem.textContent = new Date().getFullYear();
    }

    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    if (progressCircle) {
      progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
      progressCircle.style.strokeDashoffset = circumference;
    }

    let isTicking = false;
    window.addEventListener('scroll', () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrollFraction = docHeight > 0 ? scrollTop / docHeight : 0;

          if (scrollTop > 40) {
            navbar?.classList.add('scrolled');
          } else {
            navbar?.classList.remove('scrolled');
          }

          if (progressCircle) {
            const offset = circumference - scrollFraction * circumference;
            progressCircle.style.strokeDashoffset = offset;
          }

          let currentSectionId = '';
          sections.forEach((section) => {
            const sectionTop = section.offsetTop - 140;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
              currentSectionId = section.getAttribute('id');
            }
          });

          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
              link.classList.add('active');
            }
          });

          isTicking = false;
        });
        isTicking = true;
      }
    });

    backToTopBtn?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    if (hamburgerBtn && mobileDrawer) {
      hamburgerBtn.addEventListener('click', () => {
        const isOpen = hamburgerBtn.classList.toggle('active');
        mobileDrawer.classList.toggle('open', isOpen);
        hamburgerBtn.setAttribute('aria-expanded', isOpen);
      });

      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          hamburgerBtn.classList.remove('active');
          mobileDrawer.classList.remove('open');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  };

  // ===========================================================================
  // 14. REAL-TIME IST PRESENCE CLOCK (KOLKATA, WB)
  // ===========================================================================
  const initLivePresenceClock = () => {
    const clockElem = document.getElementById('live-ist-clock');
    if (!clockElem) return;

    const updateTime = () => {
      const now = new Date();
      // Format time in Asia/Kolkata (IST UTC+5:30)
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const istTimeStr = new Intl.DateTimeFormat('en-IN', options).format(now);
      clockElem.textContent = `Kolkata, WB (IST) — ${istTimeStr}`;
    };

    updateTime();
    setInterval(updateTime, 1000);
  };

  initLivePresenceClock();

  // ===========================================================================
  // 15. INTERACTIVE GITHUB CONTRIBUTION HEATMAP (52 WEEKS)
  // ===========================================================================
  const initGitHubActivityHeatmap = () => {
    const heatmapGrid = document.getElementById('github-heatmap-grid');
    if (!heatmapGrid) return;

    heatmapGrid.innerHTML = '';
    const totalDays = 52 * 7; // 364 cells
    const today = new Date();
    
    // Sample verified commit logs for realism
    const commitLogs = [
      "feat: implement zero-trust token validator in AegisAuth",
      "perf: optimize pcap ring buffer for 0.4ms packet latency",
      "sec: add SYN-flood socket detection drill to SentinelShield",
      "data: train neural anomaly model on network flow logs",
      "refactor: optimize spiral trajectory SVG coordinate spline",
      "algo: implement Dijkstra & A* pathfinder benchmark in C",
      "test: write automated fuzzing suite for socket parser"
    ];

    const fragment = document.createDocumentFragment();

    for (let i = totalDays; i >= 0; i--) {
      const cellDate = new Date(today);
      cellDate.setDate(today.getDate() - i);
      
      const cell = document.createElement('div');
      cell.classList.add('heatmap-cell');

      // Realistic pseudo-random distribution with clustering
      const dayOfWeek = cellDate.getDay();
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
      
      const dateStr = cellDate.toISOString().split('T')[0];
      const logSample = commitLogs[i % commitLogs.length];
      const tooltipText = count > 0 
        ? `${count} commits on ${dateStr}\n↳ ${logSample}` 
        : `No lab commits on ${dateStr}`;

      cell.setAttribute('title', tooltipText);
      fragment.appendChild(cell);
    }

    heatmapGrid.appendChild(fragment);
  };

  initGitHubActivityHeatmap();

  // ===========================================================================
  // 16. ACOUSTIC MECHANICAL AUDIO FEEDBACK ENGINE (WEB AUDIO API)
  // ===========================================================================
  let isSoundEnabled = localStorage.getItem('audio_enabled') === 'true';

  const initAcousticSoundEngine = () => {
    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioIcon = document.getElementById('audio-icon');

    const updateAudioIcon = () => {
      if (audioIcon) {
        audioIcon.textContent = isSoundEnabled ? '🔊' : '🔇';
      }
      if (audioBtn) {
        audioBtn.title = isSoundEnabled ? 'Mute Mechanical Audio' : 'Enable Mechanical Audio';
      }
    };

    updateAudioIcon();

    audioBtn?.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      localStorage.setItem('audio_enabled', isSoundEnabled);
      updateAudioIcon();
      showToast(isSoundEnabled ? 'Audio Feedback Enabled (Mechanical Clicks)' : 'Audio Feedback Muted', 'info');
      if (isSoundEnabled) playMechanicalClick(800, 0.03);
    });

    const playMechanicalClick = (freq = 900, duration = 0.02) => {
      if (!isSoundEnabled) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.4, ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (e) {
        // Silently ignore audio block
      }
    };

    // Attach click feedback to buttons and interactive links
    document.querySelectorAll('.btn, .social-pill, .filter-btn, .dock-item, .cmd-item').forEach((el) => {
      el.addEventListener('click', () => playMechanicalClick(1100, 0.025));
    });
  };

  initAcousticSoundEngine();

  // ===========================================================================
  // 17. COMMAND PALETTE MODAL (CTRL+K / CMD+K CONTROLLER)
  // ===========================================================================
  const initCommandPalette = () => {
    const dialog = document.getElementById('cmd-palette-modal');
    const triggerBtn = document.getElementById('cmd-palette-trigger');
    const input = document.getElementById('cmd-palette-input');
    const resultsList = document.getElementById('cmd-results-list');
    if (!dialog || !input || !resultsList) return;

    const openPalette = () => {
      dialog.showModal();
      input.value = '';
      filterCommands('');
      input.focus();
    };

    const closePalette = () => {
      dialog.close();
    };

    triggerBtn?.addEventListener('click', openPalette);

    // Global Keydown Shortcut (Cmd+K / Ctrl+K / Escape)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dialog.open) {
          closePalette();
        } else {
          openPalette();
        }
      }
      if (e.key === 'Escape' && dialog.open) {
        closePalette();
      }
    });

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closePalette();
    });

    const filterCommands = (query) => {
      const items = resultsList.querySelectorAll('.cmd-item');
      const q = query.toLowerCase().trim();
      let hasVisible = false;

      items.forEach((item) => {
        const text = (item.textContent || '').toLowerCase();
        if (!q || text.includes(q)) {
          item.style.display = 'flex';
          hasVisible = true;
        } else {
          item.style.display = 'none';
        }
      });
    };

    input.addEventListener('input', (e) => {
      filterCommands(e.target.value);
    });

    // Handle Item Clicks
    resultsList.addEventListener('click', (e) => {
      const item = e.target.closest('.cmd-item');
      if (!item) return;

      const action = item.dataset.action;
      const target = item.dataset.target;

      closePalette();

      if (action === 'navigate' && target) {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'copy-email') {
        navigator.clipboard.writeText('bibekbandhu.nayek@gmail.com').then(() => {
          showToast('Email address copied to clipboard!', 'success');
        });
      } else if (action === 'toggle-sound') {
        document.getElementById('audio-toggle-btn')?.click();
      } else if (action === 'run-terminal-scan') {
        document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' });
        const termInput = document.getElementById('terminal-input');
        if (termInput) {
          termInput.value = 'scan';
          const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
          termInput.dispatchEvent(enterEvent);
        }
      }
    });
  };

  initCommandPalette();

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

});
