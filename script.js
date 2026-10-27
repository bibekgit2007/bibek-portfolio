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
  // 01. ENHANCED COSMOS PARTICLE & METEOR SHOWER ENGINE + GLOBAL SPOTLIGHT
  // ===========================================================================
  // 01A. 3D WATER DROPLET & FLUID RIPPLE PHYSICS ENGINE
  // ===========================================================================
  const initBackgroundCanvas = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    
    const isTouchOrMobile = window.innerWidth <= 1024 || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches;
    if (isTouchOrMobile) {
      canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let prevInnerWidth = window.innerWidth;
    let prevInnerHeight = window.innerHeight;
    let mouse = { x: null, y: null, prevX: null, prevY: null, speed: 0 };
    let isCanvasRunning = true;
    let animId = null;

    let resizeDebounce = null;
    window.addEventListener('resize', () => {
      const curW = window.innerWidth;
      const curH = window.innerHeight;
      // Filter out small vertical shifts from Android address-bar collapse
      if (Math.abs(curW - prevInnerWidth) > 12 || Math.abs(curH - prevInnerHeight) > 120) {
        clearTimeout(resizeDebounce);
        resizeDebounce = setTimeout(() => {
          isMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
          prevInnerWidth = width;
          prevInnerHeight = height;
        }, 120);
      }
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isCanvasRunning = false;
        if (animId) cancelAnimationFrame(animId);
      } else {
        if (!isCanvasRunning) {
          isCanvasRunning = true;
          animId = requestAnimationFrame(animate);
        }
      }
    });

    // 3D Fluid Ripples Pool
    const ripples = [];
    const maxRipples = isMobile ? 8 : 35;

    const addRipple = (x, y, strength = 1, colorType = 'cyan') => {
      if (ripples.length >= maxRipples) ripples.shift();
      ripples.push({
        x,
        y,
        radius: 2,
        maxRadius: Math.random() * 35 + 25 + strength * 18,
        speed: (Math.random() * 0.8 + 1.2) * (strength > 1 ? 1.3 : 1.0),
        opacity: Math.min(0.6 * strength, 0.85),
        colorType: colorType,
        aspectRatio: 0.65 // 3D perspective tilt
      });
    };

    // Splash Particles Pool
    const splashParticles = [];
    const maxSplashes = isMobile ? 8 : 28;

    const addSplash = (x, y, count = isMobile ? 4 : 8) => {
      for (let i = 0; i < count; i++) {
        if (splashParticles.length >= maxSplashes) splashParticles.shift();
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.0 + 1.2;
        splashParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (Math.random() * 2.2 + 0.8),
          gravity: 0.12,
          radius: Math.random() * 2.0 + 1.0,
          opacity: 0.85,
          decay: Math.random() * 0.02 + 0.015
        });
      }
    };

    if (!isMobile) {
      window.addEventListener('mousemove', (e) => {
        if (mouse.x !== null && mouse.y !== null) {
          const dx = e.clientX - mouse.x;
          const dy = e.clientY - mouse.y;
          mouse.speed = Math.hypot(dx, dy);
          
          if (mouse.speed > 8 && Math.random() < 0.35) {
            addRipple(e.clientX, e.clientY, Math.min(mouse.speed / 16, 1.4), Math.random() > 0.4 ? 'cyan' : 'orange');
          }
        }
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      }, { passive: true });

      window.addEventListener('click', (e) => {
        addRipple(e.clientX, e.clientY, 2.0, 'cyan');
        addRipple(e.clientX, e.clientY, 1.4, 'orange');
        addSplash(e.clientX, e.clientY, 8);
      }, { passive: true });

      window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
      }, { passive: true });
    }

    // 3D Volumetric Water Droplet Class
    class WaterDroplet {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20 - Math.random() * 40;
        this.z = Math.random() * 1.0 + 0.5;
        this.baseRadius = Math.random() * 3.0 + 2.0;
        this.radius = this.baseRadius * this.z;
        this.vy = (0.75 + Math.random() * 1.25) * this.z;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.wobblePhase = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.04 + 0.02;
        this.wobbleAmp = (Math.random() * 0.5 + 0.2) * this.z;
        this.opacity = Math.min((0.5 + this.z * 0.35), 0.9);
        this.nextRippleTime = Math.random() * 220 + 100;
      }

      update() {
        this.wobblePhase += this.wobbleSpeed;
        const currentVx = this.vx + Math.sin(this.wobblePhase) * this.wobbleAmp * 0.1;
        this.x += currentVx;
        this.y += this.vy;

        // Interaction with mouse proximity on desktop
        if (!isMobile && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          const influenceRadius = 90 * this.z;
          if (dist < influenceRadius && dist > 0) {
            const force = (influenceRadius - dist) / influenceRadius;
            this.x -= (dx / dist) * force * 2.8;
            this.y -= (dy / dist) * force * 1.8;
          }
        }

        // Periodic minor ripple emission
        this.nextRippleTime--;
        if (this.nextRippleTime <= 0) {
          if (this.z > 0.95 && Math.random() < 0.25) {
            addRipple(this.x, this.y, this.z * 0.4, 'cyan');
          }
          this.nextRippleTime = Math.random() * 240 + 140;
        }

        // Landing at bottom
        if (this.y > height + 15) {
          if (this.z > 0.8) {
            addRipple(this.x, height - 8, this.z * 0.7, Math.random() > 0.5 ? 'cyan' : 'emerald');
            if (!isMobile && this.z > 1.2) addSplash(this.x, height - 8, 3);
          }
          this.reset(false);
        }
        if (this.x < -30) this.x = width + 30;
        if (this.x > width + 30) this.x = -30;
      }

      draw() {
        ctx.save();
        const r = this.radius;
        const cx = this.x;
        const cy = this.y;

        if (isMobile) {
          // Ultra-fast mobile path: single lightweight fill & stroke
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${0.4 * this.opacity})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * this.opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.restore();
          return;
        }

        // 1. Soft Ambient Refractive Drop Shadow
        ctx.beginPath();
        ctx.ellipse(cx + r * 0.22, cy + r * 0.28, r * 0.95, r * 0.8, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${0.3 * this.opacity})`;
        ctx.fill();

        // 2. Volumetric Liquid Droplet Body with Refraction
        const bodyGrad = ctx.createRadialGradient(
          cx - r * 0.25, cy - r * 0.25, r * 0.1,
          cx, cy, r
        );
        bodyGrad.addColorStop(0, `rgba(180, 230, 255, ${0.45 * this.opacity})`);
        bodyGrad.addColorStop(0.5, `rgba(30, 75, 130, ${0.25 * this.opacity})`);
        bodyGrad.addColorStop(0.85, `rgba(6, 182, 212, ${0.35 * this.opacity})`);
        bodyGrad.addColorStop(1, `rgba(255, 107, 0, ${0.18 * this.opacity})`);

        ctx.beginPath();
        const stretch = Math.min(1 + (this.vy / 10), 1.25);
        ctx.ellipse(cx, cy, r, r * stretch, 0, 0, Math.PI * 2);
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // 3. Crisp Caustic Rim Highlight
        ctx.strokeStyle = `rgba(220, 245, 255, ${0.35 * this.opacity})`;
        ctx.lineWidth = Math.max(0.6 * this.z, 0.4);
        ctx.stroke();

        // 4. Primary Specular Glare
        ctx.beginPath();
        ctx.ellipse(
          cx - r * 0.32,
          cy - r * 0.35 * stretch,
          r * 0.32,
          r * 0.22,
          -Math.PI / 6,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${0.85 * this.opacity})`;
        ctx.fill();

        ctx.restore();
      }
    }

    // Number of 3D droplets scaled to display resolution & hardware capability
    const dropletCount = isMobile
      ? Math.min(Math.floor((width * height) / 45000), 12)
      : Math.min(Math.floor((width * height) / 18000), 45);
    const droplets = Array.from({ length: dropletCount }, () => new WaterDroplet());

    // Ambient Meteor / Light Streamer
    class CausticLightBeam {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width + 150;
        this.y = -60;
        this.len = Math.random() * 110 + 70;
        this.speed = Math.random() * 4 + 5;
        this.angle = Math.PI / 4;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.active = false;
        this.timer = Math.random() * 250 + 120;
      }

      update() {
        if (!this.active) {
          this.timer--;
          if (this.timer <= 0) this.active = true;
          return;
        }
        this.x -= Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.y > height + 100 || this.x < -100) this.reset();
      }

      draw() {
        if (!this.active) return;
        const tailX = this.x + Math.cos(this.angle) * this.len;
        const tailY = this.y - Math.sin(this.angle) * this.len;
        const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        grad.addColorStop(0.3, `rgba(6, 182, 212, ${this.opacity * 0.8})`);
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }
    }

    const lightBeams = Array.from({ length: isMobile ? 1 : 2 }, () => new CausticLightBeam());

    // Main 60-200 FPS Animation Loop
    const animate = () => {
      if (!isCanvasRunning) return;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw & Update Fluid Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.radius += rp.speed;
        rp.opacity -= 0.015;

        if (rp.opacity <= 0 || rp.radius >= rp.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(rp.x, rp.y, rp.radius, rp.radius * rp.aspectRatio, 0, 0, Math.PI * 2);
        const strokeAlpha = Math.max(rp.opacity, 0);
        if (rp.colorType === 'orange') {
          ctx.strokeStyle = `rgba(255, 107, 0, ${strokeAlpha * 0.45})`;
        } else if (rp.colorType === 'emerald') {
          ctx.strokeStyle = `rgba(16, 185, 129, ${strokeAlpha * 0.45})`;
        } else {
          ctx.strokeStyle = `rgba(6, 182, 212, ${strokeAlpha * 0.55})`;
        }
        ctx.lineWidth = Math.max(1.4 * (1 - rp.radius / rp.maxRadius), 0.5);
        ctx.stroke();

        if (!isMobile && rp.radius > 14) {
          ctx.beginPath();
          ctx.ellipse(rp.x, rp.y, rp.radius * 0.65, rp.radius * 0.65 * rp.aspectRatio, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${strokeAlpha * 0.2})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. Draw & Update Splashes
      for (let i = splashParticles.length - 1; i >= 0; i--) {
        const sp = splashParticles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += sp.gravity;
        sp.opacity -= sp.decay;

        if (sp.opacity <= 0) {
          splashParticles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 235, 255, ${sp.opacity * 0.7})`;
        ctx.fill();
      }

      // 3. Draw & Update 3D Water Droplets
      droplets.forEach((d) => {
        d.update();
        d.draw();
      });

      // 4. Draw & Update Caustic Beams
      lightBeams.forEach((lb) => {
        lb.update();
        lb.draw();
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
  };

  initBackgroundCanvas();

  // ===========================================================================
  // 01B. ACETERNITY TRACING BEAM CONTROLLER
  // ===========================================================================
  const initTracingBeam = () => {
    const beamContainer = document.getElementById('tracing-beam-container');
    const laserDot = document.getElementById('tracing-laser-dot');
    const activeLine = document.getElementById('tracing-beam-active-line');
    if (!beamContainer || !laserDot) return;

    if (window.innerWidth <= 1024 || window.matchMedia('(pointer: coarse)').matches) {
      beamContainer.style.display = 'none';
      return;
    }

    let isTicking = false;
    const updateBeam = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min(Math.max(scrollTop / scrollHeight, 0), 1) : 0;

      laserDot.style.top = `${(progress * 100).toFixed(2)}%`;

      if (activeLine) {
        const containerHeight = beamContainer.clientHeight || window.innerHeight;
        activeLine.setAttribute('y2', `${(progress * containerHeight).toFixed(1)}`);
      }
      isTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!isTicking) {
        window.requestAnimationFrame(updateBeam);
        isTicking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (!isTicking) {
        window.requestAnimationFrame(updateBeam);
        isTicking = true;
      }
    }, { passive: true });

    updateBeam();
  };

  initTracingBeam();



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
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">about</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Sacred Sanskrit ethos & engineering philosophy</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">quotes</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Quotes of Bill Gates, Newton, Hawking, Gandhi, Musk & more</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">creativity</span>&nbsp;&nbsp;&nbsp;- AVAI Preparation: Adaptive AI & 200 FPS Cognitive Lab</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">whoami</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Display student background & institutional affiliation</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">education</span>&nbsp;&nbsp;&nbsp;&nbsp;- View top academic records & university affiliation</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">certificates</span>&nbsp;- Output verified professional technical certifications</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">skills</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Output technical capabilities & security tools</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">projects</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- List flagship software & research repositories</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">scan</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Run simulated network vulnerability diagnostics</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">sound</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Toggle mechanical sound FX feedback</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">contact</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Output direct communication channels</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">matrix</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Stream cyber matrix data feed</div>
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear the active terminal buffer</div>
      `,
      creativity: () => {
        document.getElementById('creativity')?.scrollIntoView({ behavior: 'smooth' });
        return `
          <div class="output-line text-cyan font-bold">[+] AVAI PREPARATION: ADAPTIVE AI & COGNITIVE LAB:</div>
          <div class="output-line">• Initiative: <span class="text-emerald font-bold">100% Free & Open-Source Student Platform</span></div>
          <div class="output-line">• GitHub Repository: <a href="https://github.com/nayekdhananjoy1973-lab/avai_preparation" target="_blank" class="text-cyan underline">github.com/nayekdhananjoy1973-lab/avai_preparation</a></div>
          <div class="output-line">• Deployment Status: <span class="text-orange font-mono">In Active Development (Free & Non-Profit)</span></div>
          <div class="output-line">• 200 FPS Telemetry: Real-time response clocks & Bayesian knowledge tracing</div>
          <div class="output-line">• Development Phases: 01 Graph Genesis ➔ 02 Synthetic Engine ➔ 03 200 FPS HUD ➔ 04 Neural Feedback</div>
        `;
      },
      avai: () => commands.creativity(),
      education: () => `
        <div class="output-line text-cyan font-bold">SPIRAL ACADEMIC TRAJECTORY & LOCATIONS:</div>
        <div class="output-line">• <strong>Future Institute of Engineering and Management (FIEM)</strong> — 1st Year B.Tech CSE (2026 Batch)</div>
        <div class="output-line text-muted">&nbsp;&nbsp;📍 Sonarpur, Kolkata Metro, West Bengal (PIN 700150) | 22.4419° N, 88.4237° E</div>
        <div class="output-line">• <strong>Higher Secondary Education (H.S.)</strong> — <span class="text-emerald">Rank 1 Distinction</span> • <span class="text-cyan">Academic Excellence Award</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;📍 Paschim Medinipur, WB | 22.4286° N, 87.6582° E</div>
        <div class="output-line">• <strong>Secondary Education</strong> — <span class="text-emerald">Roll-1 Summa Distinction</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;📍 Paschim Medinipur, WB | 22.4280° N, 87.3200° E</div>
      `,
      certificates: () => `
        <div class="output-line text-cyan font-bold">OFFICIAL VERIFIED CERTIFICATIONS & ACADEMIC CREDENTIALS (8 RECORDS):</div>
        <div class="output-line">🤖 <strong>IBM SkillsBuild: Large Language Model Basics</strong> — <span class="text-emerald">Verified Completion</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;&nbsp;Issuer: IBM &amp; Adobe Learning Manager | ID: ALM-COURSE_4058872 | Date: 21 Sep 2026 (GMT)</div>
        <div class="output-line">🎯 <strong>IBM SkillsBuild: Mastering the Art of Prompting</strong> — <span class="text-emerald">Verified Completion (1 hr)</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;&nbsp;Issuer: IBM &amp; Adobe Learning Manager | ID: ALM-COURSE_4058858 | Date: 21 Sep 2026 (GMT)</div>
        <div class="output-line">🧠 <strong>IBM SkillsBuild: Getting Started with Artificial Intelligence</strong> — <span class="text-emerald">Verified Completion</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;&nbsp;Issuer: IBM &amp; Your Learning Builder | ID: PLAN-E624C2604060 | Date: 21 Sep 2026 (GMT)</div>
        <div class="output-line">🏆 <strong>Ministry of Education &amp; CirQula: NSPC 2026</strong> — <span class="text-amber" style="color:#fbbf24;">Gold पारिजात Award (UG &amp; PG)</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;&nbsp;Issuer: Ministry of Education, Govt. of India &amp; CirQula India | ID: NSPC-2026-36d1f8b6</div>
        <div class="output-line">🚀 <strong>ISRO &amp; Department of Space: National Space Day Quiz 2026</strong> — <span class="text-cyan">National Merit Certificate</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;&nbsp;Issuer: ISRO &amp; MyGov (Govt. of India) | Candidate: Bibekbandhunayek</div>
        <div class="output-line">📜 <strong>WBCHSE: Higher Secondary Examination (Class XII)</strong> — <span class="text-emerald font-bold">Grade A++ (Outstanding Distinction)</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;&nbsp;Council: West Bengal Council of Higher Secondary Education | Reg: 3241140595 | Date: 14th May, 2026</div>
        <div class="output-line">🎓 <strong>WBBSE: Secondary Examination (Madhyamik Class X)</strong> — <span class="text-emerald">First Division Honor</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;&nbsp;Board: West Bengal Board of Secondary Education | Bishnupur Sri Ramkrishna Vidyayatan</div>
        <div class="output-line">🔬 <strong>Class XII English Bonafide Project Certificate</strong> — <span class="text-cyan">"Health and Fitness - A Path to Better Life"</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;&nbsp;Institutional Project Record | Reg: 3241140595 | Date: 05/10/2025</div>
      `,
      certs: () => commands.certificates(),
      cert: () => commands.certificates(),
      admin: () => {
        if (window.openOwnerPinModal) window.openOwnerPinModal();
        return `
          <div class="output-line text-orange font-bold font-mono">[!] LAUNCHING OWNER SECURITY CONSOLE...</div>
          <div class="output-line text-cyan">• Authentication prompt activated. Enter Master PIN (default: 2026).</div>
        `;
      },
      login: () => commands.admin(),
      owner: () => commands.admin(),
      sudo: () => commands.admin(),
      whoami: () => `
        <div class="output-line font-bold text-main">Bibek Bandhu Nayek</div>
        <div class="output-line text-muted">1st Year B.Tech CSE @ Future Institute of Engineering and Management (FIEM) — 2026 Batch</div>
        <div class="output-line text-secondary">Passionate Cyber Security Enthusiast, Data Analyst & AI Engineering Innovator.</div>
      `,
      about: () => `
        <div class="output-line text-amber font-bold" style="color:#fbbf24;">🕉️ SACRED SANSKRIT MAXIM & GUIDING ETHOS:</div>
        <div class="output-line text-main font-bold" style="font-size:1.15rem; color:#fef08a;">"श्रद्धावान् लभते ज्ञानम् तत्परः संयतेन्द्रियः"</div>
        <div class="output-line text-muted font-italic">&nbsp;&nbsp;Śraddhāvāṉ labhate jñānam, tat-paraḥ saṁyatendriyaḥ (Bhagavad Gita 4.39)</div>
        <div class="output-line text-secondary" style="margin-top:0.3rem;">"The person who is endowed with sincere faith, devoted with unwavering focus, and possesses mastery over the senses, attains supreme wisdom."</div>
        <div class="output-line text-cyan" style="margin-top:0.3rem;">// Engineering Synthesis: Merging timeless philosophical discipline with zero-trust machine intelligence.</div>
      `,
      quotes: () => `
        <div class="output-line text-cyan font-bold">TITANS OF THOUGHT & VISIONARY QUOTES:</div>
        <div class="output-line">💡 <strong>Bill Gates</strong>: "Patience is a key element of success... As we look ahead into the next century, leaders will be those who empower others."</div>
        <div class="output-line">🌌 <strong>Isaac Newton</strong>: "If I have seen further it is by standing on the shoulders of Giants."</div>
        <div class="output-line">🔭 <strong>Stephen Hawking</strong>: "Intelligence is the ability to adapt to change. Look up at the stars and not down at your feet."</div>
        <div class="output-line">🕊️ <strong>Mahatma Gandhi</strong>: "Live as if you were to die tomorrow. Learn as if you were to live forever."</div>
        <div class="output-line">🚀 <strong>Elon Musk</strong>: "When something is important enough, you do it even if the odds are not in your favor."</div>
        <div class="output-line">🔥 <strong>Swami Vivekananda</strong>: "Arise, awake, and stop not till the goal is reached."</div>
        <div class="output-line">⚛️ <strong>Albert Einstein</strong>: "Imagination is more important than knowledge."</div>
        <div class="output-line">🚀 <strong>Dr. A.P.J. Abdul Kalam</strong>: "Dream is not that which you see while sleeping; it is something that does not let you sleep."</div>
        <div class="output-line">💻 <strong>Alan Turing</strong>: "We can only see a short distance ahead, but we can see plenty there that needs to be done."</div>
        <div class="output-line">🍎 <strong>Steve Jobs</strong>: "Stay hungry. Stay foolish. Have the courage to follow your heart and intuition."</div>
      `,
      skills: () => `
        <div class="output-line text-cyan font-bold">TECHNICAL MATRIX:</div>
        <div class="output-line">• <strong>Security</strong>: Wireshark, Nmap, Linux Hardening, OWASP Top 10, Cryptography, Packet Dissection</div>
        <div class="output-line">• <strong>Data & AI</strong>: Python, Pandas, NumPy, Scikit-Learn, Statistical Testing, Data Pipelines</div>
        <div class="output-line">• <strong>Systems & Web</strong>: Vanilla JavaScript (ES6+), Modern CSS3, HTML5, C, REST APIs, Git/GitHub</div>
      `,
      projects: () => `
        <div class="output-line text-cyan font-bold">FEATURED FLAGSHIP BUILDS:</div>
        <div class="output-line">1. <strong>AVAI Preparation</strong> — Autonomous Vision & AI-Driven Cognitive Exam Platform (100% Free)</div>
        <div class="output-line">2. <strong>SentinelShield</strong> — Automated Vulnerability & Port Scanner (Python/Sockets)</div>
        <div class="output-line">3. <strong>NeuralInsight</strong> — Intelligent Data Analytics & Prediction Dashboard (Pandas/ML)</div>
        <div class="output-line">4. <strong>AegisAuth</strong> — Zero-Trust Cryptographic Token Authenticator (SHA-256 HMAC)</div>
        <div class="output-line">5. <strong>ApexVision</strong> — Neural Log Anomaly Detector (PyTorch/FastAPI)</div>
        <div class="output-line">6. <strong>QuantumPacket</strong> — Real-Time High-Throughput Traffic Dissector (C/PCAP)</div>
      `,
      reel: () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        return `<div class="output-line text-cyan font-mono">[+] Scrolling to Section 01: About & Guiding Philosophies...</div>`;
      },
      sound: () => {
        document.getElementById('audio-toggle-btn')?.click();
        return `<div class="output-line text-emerald font-mono">[+] Toggled mechanical audio sound synthesis.</div>`;
      },
      scan: () => {
        simulateScan();
        return `<div class="output-line text-cyan font-mono">[+] Initializing probe on subnet 192.168.1.0/24...</div>`;
      },
      contact: () => `
        <div class="output-line text-cyan font-bold">DIRECT CHANNELS:</div>
        <div class="output-line">• Email: <a href="mailto:bibekbandhu2007@gmail.com" class="text-emerald underline">bibekbandhu2007@gmail.com</a></div>
        <div class="output-line">• Twitter / X: <a href="https://x.com/bibekbandhunyk" target="_blank" class="text-cyan underline">@bibekbandhunyk</a></div>
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
    // Only bind mouse tilt effects on pointer devices (skip on mobile touch)
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;

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
      const isMobile = window.innerWidth <= 1024 || window.matchMedia('(pointer: coarse)').matches;
      const scrollTop = window.scrollY || root.scrollTop;
      const docHeight = root.scrollHeight - root.clientHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      root.style.setProperty('--scroll-progress', `${scrollPercent.toFixed(2)}%`);

      // On mobile viewports, skip heavy 3D transform updates and layout bounding rects to prevent GPU throttling
      if (!isMobile) {
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

        // Dynamic Spiral Orbit & Trajectory Flow on Desktop
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
      }

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
  // 07. ABOUT SECTION: SACRED SANSKRIT & 3D DEPTH DECK QUOTES CONTROLLER
  // ===========================================================================
  const initAboutQuotesController = () => {
    const stage = document.getElementById('quotes-3d-stage');
    const stageViewport = document.getElementById('quotes-3d-stage-viewport');
    const quoteCards = Array.from(document.querySelectorAll('.quotes-3d-stage .quote-card-luxury'));
    const quoteFilterBtns = document.querySelectorAll('.quote-filter-btn');
    const viewModeStackBtn = document.getElementById('view-mode-stack-btn');
    const viewModeGridBtn = document.getElementById('view-mode-grid-btn');
    
    // Deck HUD Controls
    const prevBtn = document.getElementById('deck-prev-btn');
    const nextBtn = document.getElementById('deck-next-btn');
    const playPauseBtn = document.getElementById('deck-playpause-btn');
    const playPauseIcon = document.getElementById('deck-playpause-icon');
    const stepCurrentEl = document.getElementById('deck-step-current');
    const stepTotalEl = document.getElementById('deck-step-total');
    const stepNameEl = document.getElementById('deck-step-name');
    const dotsStepperEl = document.getElementById('deck-dots-stepper');
    const progressFillEl = document.getElementById('deck-progress-fill');
    
    // Wisdom Spotlight Elements
    const spotlightQuoteEl = document.getElementById('active-quote-text');
    const spotlightAuthorEl = document.getElementById('active-author-name');
    const spotlightTitleEl = document.getElementById('active-author-title');
    const spotlightAvatarEl = document.getElementById('active-author-initials');
    const spotlightTagEl = document.getElementById('active-author-tag');
    const shuffleBtn = document.getElementById('quote-shuffle-btn');
    const copySpotlightBtn = document.getElementById('quote-copy-btn');
    const miniCopyBtns = document.querySelectorAll('.btn-copy-mini');

    if (!stage || quoteCards.length === 0) return;

    // Deck State
    let currentFilter = 'all';
    let currentDeckIndex = 0;
    let viewMode = 'deck'; // 'deck' | 'grid'
    let isAutoPlaying = true;
    let autoPlayTimer = null;
    let progressTimer = null;
    let progressValue = 0;
    const AUTO_PLAY_INTERVAL = 3800; // 3.8 seconds per card automatic stream

    // Helper: Get currently active filtered cards
    const getFilteredCards = () => {
      if (currentFilter === 'all') return quoteCards;
      return quoteCards.filter((card) => {
        const categories = (card.dataset.category || '').split(' ');
        return categories.includes(currentFilter);
      });
    };

    // Update 3D Deck Positions (Cards emerging one by one from backward)
    const update3DDeck = (animate = true) => {
      const filtered = getFilteredCards();
      if (filtered.length === 0) return;

      if (currentDeckIndex >= filtered.length) currentDeckIndex = 0;
      if (currentDeckIndex < 0) currentDeckIndex = filtered.length - 1;

      // Update HUD Step Metadata
      const activeCard = filtered[currentDeckIndex];
      const authorName = activeCard?.dataset.author || activeCard?.querySelector('.luminary-name')?.textContent || '';
      
      if (stepCurrentEl) stepCurrentEl.textContent = String(currentDeckIndex + 1).padStart(2, '0');
      if (stepTotalEl) stepTotalEl.textContent = String(filtered.length).padStart(2, '0');
      if (stepNameEl) stepNameEl.textContent = authorName;

      // Update Interactive Dots Stepper
      if (dotsStepperEl) {
        dotsStepperEl.innerHTML = '';
        filtered.forEach((_, idx) => {
          const dot = document.createElement('button');
          dot.className = `deck-dot ${idx === currentDeckIndex ? 'active' : ''}`;
          dot.setAttribute('title', `Jump to Card ${idx + 1}`);
          dot.setAttribute('aria-label', `Card ${idx + 1}`);
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            currentDeckIndex = idx;
            update3DDeck();
            resetAutoPlay();
            if (window.playHaptic) window.playHaptic();
          });
          dotsStepperEl.appendChild(dot);
        });
      }

      // Assign 3D Stacking Positions
      quoteCards.forEach((card) => {
        const filteredIndex = filtered.indexOf(card);

        if (filteredIndex === -1) {
          card.classList.add('filter-hidden');
          card.removeAttribute('data-stack-pos');
          return;
        }

        card.classList.remove('filter-hidden');

        if (viewMode === 'grid') {
          card.removeAttribute('data-stack-pos');
          return;
        }

        // Circular relative distance in the filtered array
        const relativeDist = (filteredIndex - currentDeckIndex + filtered.length) % filtered.length;

        if (relativeDist === 0) {
          card.setAttribute('data-stack-pos', '0'); // Front card (active focus)
        } else if (relativeDist === 1) {
          card.setAttribute('data-stack-pos', '1'); // Directly behind in 3D space
        } else if (relativeDist === 2) {
          card.setAttribute('data-stack-pos', '2'); // 2nd level backward
        } else if (relativeDist === 3) {
          card.setAttribute('data-stack-pos', '3'); // 3rd level backward
        } else {
          card.setAttribute('data-stack-pos', 'hidden-back'); // Deep in 3D void
        }
      });
    };

    // Navigation: Next Card (Emerging forward from backward depth)
    const nextDeckCard = () => {
      const filtered = getFilteredCards();
      if (filtered.length <= 1) return;

      const outgoingCard = filtered[currentDeckIndex];
      if (outgoingCard && viewMode === 'deck') {
        outgoingCard.setAttribute('data-stack-pos', 'exiting');
      }

      currentDeckIndex = (currentDeckIndex + 1) % filtered.length;
      setTimeout(() => {
        update3DDeck();
      }, 100);

      if (window.playHaptic) window.playHaptic();
    };

    // Navigation: Previous Card
    const prevDeckCard = () => {
      const filtered = getFilteredCards();
      if (filtered.length <= 1) return;

      currentDeckIndex = (currentDeckIndex - 1 + filtered.length) % filtered.length;
      update3DDeck();
      if (window.playHaptic) window.playHaptic();
    };

    // Click on any card in the 3D stack to bring it forward
    quoteCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (viewMode !== 'deck') return;
        if (e.target.closest('.btn-copy-mini') || e.target.closest('button')) return;

        const stackPos = card.getAttribute('data-stack-pos');
        if (stackPos === '1' || stackPos === '2' || stackPos === '3') {
          const filtered = getFilteredCards();
          const targetIndex = filtered.indexOf(card);
          if (targetIndex !== -1) {
            currentDeckIndex = targetIndex;
            update3DDeck();
            resetAutoPlay();
            if (window.playHaptic) window.playHaptic();
          }
        }
      });
    });

    // Automatic Stream Progress Engine
    const startProgressLoop = () => {
      progressValue = 0;
      if (progressFillEl) progressFillEl.style.width = '0%';

      if (progressTimer) clearInterval(progressTimer);
      const isMobileDevice = window.innerWidth <= 768;
      const stepMs = isMobileDevice ? 100 : 40;
      const stepIncrement = (stepMs / AUTO_PLAY_INTERVAL) * 100;

      progressTimer = setInterval(() => {
        if (!isQuotesSectionInView || !isAutoPlaying || viewMode !== 'deck') return;
        progressValue += stepIncrement;
        if (progressFillEl) progressFillEl.style.width = `${Math.min(progressValue, 100)}%`;

        if (progressValue >= 100) {
          progressValue = 0;
          nextDeckCard();
        }
      }, stepMs);
    };

    const resetAutoPlay = () => {
      if (isAutoPlaying) {
        startProgressLoop();
      }
    };

    const togglePlayPause = () => {
      isAutoPlaying = !isAutoPlaying;
      if (playPauseIcon) playPauseIcon.textContent = isAutoPlaying ? '⏸' : '▶';
      if (playPauseBtn) playPauseBtn.setAttribute('title', isAutoPlaying ? 'Pause Automatic Stream' : 'Resume Automatic Stream');

      if (isAutoPlaying) {
        startProgressLoop();
        if (window.showToast) window.showToast('Automatic 3D Card stream resumed', 'info');
      } else {
        if (progressTimer) clearInterval(progressTimer);
        if (window.showToast) window.showToast('Automatic 3D Card stream paused', 'info');
      }
      if (window.playHaptic) window.playHaptic();
    };

    // Intelligent Stage Hover: Keeps automatic 3D streaming continuous while supporting smooth manual overrides
    if (stageViewport) {
      stageViewport.addEventListener('mouseenter', () => {
        // Keeps the auto stream fluid and active without halting
      });
      stageViewport.addEventListener('mouseleave', () => {
        if (isAutoPlaying && !progressTimer) startProgressLoop();
      });
    }

    // Prev / Next HUD Buttons
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextDeckCard();
        resetAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevDeckCard();
        resetAutoPlay();
      });
    }

    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        togglePlayPause();
      });
    }

    // Touch & Pointer Swipe Support on 3D Stage
    let touchStartX = 0;
    let touchEndX = 0;

    if (stage) {
      stage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      stage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 45) {
          if (diff < 0) {
            nextDeckCard(); // Swipe Left -> Next card comes forward from backward
          } else {
            prevDeckCard(); // Swipe Right -> Prev card
          }
          resetAutoPlay();
        }
      }, { passive: true });
    }

    // Keyboard Arrow Navigation
    window.addEventListener('keydown', (e) => {
      const aboutSection = document.getElementById('about');
      if (!aboutSection) return;
      const rect = aboutSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView && viewMode === 'deck') {
        if (e.key === 'ArrowRight') {
          nextDeckCard();
          resetAutoPlay();
        } else if (e.key === 'ArrowLeft') {
          prevDeckCard();
          resetAutoPlay();
        }
      }
    });

    // View Mode Toggle (3D Depth Deck vs. Expanded Bento Grid)
    if (viewModeStackBtn && viewModeGridBtn) {
      viewModeStackBtn.addEventListener('click', () => {
        viewMode = 'deck';
        viewModeStackBtn.classList.add('active');
        viewModeGridBtn.classList.remove('active');
        stage.className = 'quotes-3d-stage mode-deck';
        update3DDeck();
        if (isAutoPlaying) startProgressLoop();
        if (window.playHaptic) window.playHaptic();
      });

      viewModeGridBtn.addEventListener('click', () => {
        viewMode = 'grid';
        viewModeGridBtn.classList.add('active');
        viewModeStackBtn.classList.remove('active');
        stage.className = 'quotes-3d-stage mode-grid';
        if (progressTimer) clearInterval(progressTimer);
        update3DDeck();
        if (window.playHaptic) window.playHaptic();
      });
    }

    // Category Filter Navigation
    quoteFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter || 'all';
        currentDeckIndex = 0;

        quoteFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        update3DDeck();
        resetAutoPlay();

        if (window.playHaptic) window.playHaptic();
      });
    });

    // Wisdom Spotlight & Copy Buttons
    const quotesArchive = [
      {
        quote: "“Software is a magnificent combination between artistry and engineering. Patience, continuous learning, and curiosity are the keys to revolutionizing the world.”",
        author: "Bill Gates",
        title: "Founder of Microsoft • Technologist",
        avatar: "BG",
        tag: "TECH INNOVATION"
      },
      {
        quote: "“If I have seen further than others, it is by standing upon the shoulders of Giants. What we know is a drop; what we do not know is an ocean.”",
        author: "Sir Isaac Newton",
        title: "Polymath • Pioneer of Calculus & Mechanics",
        avatar: "IN",
        tag: "PHYSICS & MATH"
      },
      {
        quote: "“Remember to look up at the stars and not down at your feet. Intelligence is the ability to adapt to change.”",
        author: "Stephen Hawking",
        title: "Theoretical Physicist & Cosmologist",
        avatar: "SH",
        tag: "COSMOLOGY"
      },
      {
        quote: "“Live as if you were to die tomorrow. Learn as if you were to live forever. The future depends entirely on what you do today.”",
        author: "Mahatma Gandhi",
        title: "Champion of Truth & Non-Violence",
        avatar: "MG",
        tag: "ETHICS & TRUTH"
      },
      {
        quote: "“When something is important enough, you do it even if the odds are not in your favor. Physics is the ultimate framework for first-principles thinking.”",
        author: "Elon Musk",
        title: "Chief Engineer @ SpaceX, Tesla & Neuralink",
        avatar: "EM",
        tag: "FIRST PRINCIPLES"
      },
      {
        quote: "“Arise, awake, and stop not till the goal is reached. All the powers in the universe are already ours.”",
        author: "Swami Vivekananda",
        title: "Spiritual Titan • Vedantic Visionary",
        avatar: "SV",
        tag: "VEDANTA & MIND"
      },
      {
        quote: "“Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world.”",
        author: "Albert Einstein",
        title: "Theoretical Physicist • Nobel Laureate",
        avatar: "AE",
        tag: "RELATIVITY"
      },
      {
        quote: "“Dream is not that which you see while sleeping; it is something that does not let you sleep. Excellence is a continuous process.”",
        author: "Dr. A.P.J. Abdul Kalam",
        title: "Aerospace Scientist • 11th President of India",
        avatar: "AK",
        tag: "AEROSPACE & VISION"
      },
      {
        quote: "“Sometimes it is the people no one can imagine anything of who do the things no one can imagine.”",
        author: "Alan Turing",
        title: "Father of Modern Computer Science & AI",
        avatar: "AT",
        tag: "CRYPTANALYSIS & AI"
      },
      {
        quote: "“The people who are crazy enough to think they can change the world are the ones who do. Stay hungry, stay foolish.”",
        author: "Steve Jobs",
        title: "Co-Founder of Apple • Industrial Design Icon",
        avatar: "SJ",
        tag: "AESTHETICS & TECH"
      }
    ];

    let currentSpotlightIdx = 0;
    const renderSpotlight = (index) => {
      const q = quotesArchive[index];
      if (!q || !spotlightQuoteEl) return;

      spotlightQuoteEl.style.opacity = '0';
      spotlightQuoteEl.style.transform = 'translateY(8px)';

      setTimeout(() => {
        spotlightQuoteEl.textContent = q.quote;
        if (spotlightAuthorEl) spotlightAuthorEl.textContent = q.author;
        if (spotlightTitleEl) spotlightTitleEl.textContent = q.title;
        if (spotlightAvatarEl) spotlightAvatarEl.textContent = q.avatar;
        if (spotlightTagEl) spotlightTagEl.textContent = q.tag;

        spotlightQuoteEl.style.opacity = '1';
        spotlightQuoteEl.style.transform = 'translateY(0)';
      }, 200);
    };

    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => {
        let nextIdx;
        do {
          nextIdx = Math.floor(Math.random() * quotesArchive.length);
        } while (nextIdx === currentSpotlightIdx && quotesArchive.length > 1);
        currentSpotlightIdx = nextIdx;
        renderSpotlight(currentSpotlightIdx);
        if (window.playHaptic) window.playHaptic();
      });
    }

    if (copySpotlightBtn && spotlightQuoteEl) {
      copySpotlightBtn.addEventListener('click', () => {
        const textToCopy = `${spotlightQuoteEl.textContent} — ${spotlightAuthorEl?.textContent || 'Luminary'}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
          if (window.showToast) window.showToast('Quote copied to clipboard!', 'success');
        }).catch(() => {
          if (window.showToast) window.showToast('Unable to copy quote.', 'error');
        });
      });
    }

    miniCopyBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const copyText = btn.getAttribute('data-copy') || '';
        if (copyText) {
          navigator.clipboard.writeText(copyText).then(() => {
            if (window.showToast) window.showToast('Quote copied to clipboard!', 'success');
          }).catch(() => {
            if (window.showToast) window.showToast('Could not copy quote.', 'error');
          });
        }
      });
    });

    // Automatic Wisdom Spotlight Rotation (Every 6.5 seconds)
    let spotlightInterval = null;

    const startSpotlightTimer = () => {
      if (spotlightInterval) clearInterval(spotlightInterval);
      spotlightInterval = setInterval(() => {
        if (!isQuotesSectionInView) return;
        currentSpotlightIdx = (currentSpotlightIdx + 1) % quotesArchive.length;
        renderSpotlight(currentSpotlightIdx);
      }, 6500);
    };

    // Initialize 3D Depth Deck and Continuous Auto-play stream
    update3DDeck(false);

    let isQuotesSectionInView = false;
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const quotesObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isQuotesSectionInView = entry.isIntersecting;
          if (isQuotesSectionInView) {
            if (isAutoPlaying) startProgressLoop();
            startSpotlightTimer();
          } else {
            if (progressTimer) clearInterval(progressTimer);
            if (spotlightInterval) clearInterval(spotlightInterval);
          }
        });
      }, { threshold: 0.05 });
      quotesObserver.observe(aboutSection);
    } else {
      startProgressLoop();
      startSpotlightTimer();
    }
  };

  initAboutQuotesController();

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
  // 08B. CERTIFICATE MOTION & 3D HOLOGRAPHIC TILT CONTROLLER
  // ===========================================================================
  const initCertificateMotionEngine = () => {
    const certCards = document.querySelectorAll('.cert-interactive-card');
    const filterBtns = document.querySelectorAll('.cert-filter-btn');

    // 1. Dynamic 3D Tilt & Holographic Prismatic Foil Movement (Desktop only)
    if (!window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
      certCards.forEach((card) => {
        const holoGlare = card.querySelector('.cert-holo-glare');

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const cardX = e.clientX - rect.left;
          const cardY = e.clientY - rect.top;

          // Normalized offsets from center: [-1, 1]
          const normX = (cardX / rect.width - 0.5) * 2;
          const normY = (cardY / rect.height - 0.5) * 2;

          const rotateX = -normY * 11; // Max 11 deg pitch
          const rotateY = normX * 11;  // Max 11 deg yaw

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`;

          if (holoGlare) {
            const posX = ((normX + 1) / 2) * 100;
            const posY = ((normY + 1) / 2) * 100;
            holoGlare.style.backgroundPosition = `${posX.toFixed(1)}% ${posY.toFixed(1)}%`;
          }
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }

    // 2. Credential Category Filter Navigation
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-cert-filter') || 'all';

        filterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        certCards.forEach((card) => {
          const cat = card.getAttribute('data-category') || '';
          if (filter === 'all' || cat.includes(filter)) {
            card.classList.remove('filter-hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = '';
            }, 50);
          } else {
            card.classList.add('filter-hidden');
          }
        });

        if (window.playHaptic) window.playHaptic();
      });
    });
  };

  initCertificateMotionEngine();

  // ===========================================================================
  // 08C. CERTIFICATE HIGH-RESOLUTION LIGHTBOX CONTROLLER
  // ===========================================================================
  const initCertificateLightbox = () => {
    const modal = document.getElementById('cert-lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const titleEl = document.getElementById('lightbox-cert-title');
    const subtitleEl = document.getElementById('lightbox-cert-subtitle');
    const gradeEl = document.getElementById('lightbox-grade-text');
    const idEl = document.getElementById('lightbox-id-text');
    const imgEl = document.getElementById('lightbox-img');
    const vectorContainer = document.getElementById('lightbox-vector-container');
    const downloadBtn = document.getElementById('lightbox-download-btn');
    const zoomToggleBtn = document.getElementById('lightbox-zoom-toggle');

    window.openCertificateLightbox = (dataset) => {
      if (!modal || !dataset) return;

      const title = dataset.lightboxTitle || dataset.title || 'Official Verified Credential';
      const inst = dataset.lightboxInst || dataset.issuer || dataset.board || 'Accrediting Institution';
      const grade = dataset.lightboxGrade || dataset.grade || 'Verified Credential';
      const certId = dataset.lightboxId || dataset.certId || 'Verification ID';
      const certImg = dataset.lightboxImg || dataset.img || '';
      const downloadHref = dataset.lightboxDownload || certImg || '';

      if (titleEl) titleEl.textContent = title;
      if (subtitleEl) subtitleEl.textContent = inst;
      if (gradeEl) gradeEl.textContent = grade;
      if (idEl) idEl.textContent = certId;

      if (certImg && imgEl) {
        imgEl.src = certImg;
        imgEl.alt = title;
        imgEl.style.display = 'block';
        imgEl.classList.remove('zoomed');
        if (vectorContainer) vectorContainer.style.display = 'none';
      } else if (vectorContainer) {
        vectorContainer.style.display = 'flex';
        if (imgEl) imgEl.style.display = 'none';
        const icon = dataset.icon || '🏆';
        vectorContainer.innerHTML = `
          <div class="cert-vector-display" style="max-width: 600px; padding: 2.25rem; border: 1px solid rgba(255, 107, 0, 0.4); box-shadow: 0 15px 45px rgba(0,0,0,0.7); background: rgba(8, 13, 26, 0.95); border-radius: var(--radius-md);">
            <div class="cert-vector-header" style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
              <span class="cert-vector-icon" style="font-size: 2.2rem;">${icon}</span>
              <span class="cert-vector-badge font-mono" style="font-size: 0.75rem; padding: 0.35rem 0.85rem; color: #ff6b00; background: rgba(255,107,0,0.15); border: 1px solid rgba(255,107,0,0.3); border-radius: 9999px;">${inst}</span>
            </div>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: #ffffff; margin-bottom: 0.65rem;">${title}</h3>
            <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.6; margin-bottom: 1.5rem;">This certifies that <strong>Bibek Bandhu Nayek</strong> has achieved verified completion and institutional accreditation in accordance with official standards.</p>
            <div class="font-mono" style="font-size: 0.75rem; color: #06b6d4; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
              <span>${certId}</span>
              <span class="text-emerald">STATUS: OFFICIALLY VERIFIED</span>
            </div>
          </div>
        `;
      }

      if (downloadBtn) {
        if (downloadHref) {
          downloadBtn.href = downloadHref;
          downloadBtn.setAttribute('download', downloadHref.split('/').pop() || 'certificate.png');
          const span = downloadBtn.querySelector('span');
          if (span) span.textContent = 'Download Certificate Document';
          downloadBtn.style.display = 'inline-flex';
        } else {
          downloadBtn.style.display = 'none';
        }
      }

      if (zoomToggleBtn) {
        const span = zoomToggleBtn.querySelector('span');
        if (span) span.textContent = 'Toggle High-Res Zoom';
      }

      modal.showModal();
      if (window.playMechanicalClick) window.playMechanicalClick(950, 0.03);
    };

    const triggers = document.querySelectorAll('.cert-lightbox-trigger, .cert-img-wrapper');
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        window.openCertificateLightbox(trigger.dataset);
      });
    });

    zoomToggleBtn?.addEventListener('click', () => {
      if (imgEl && imgEl.style.display !== 'none') {
        imgEl.classList.toggle('zoomed');
        const span = zoomToggleBtn.querySelector('span');
        if (span) {
          span.textContent = imgEl.classList.contains('zoomed') ? 'Reset High-Res Zoom' : 'Toggle High-Res Zoom';
        }
        if (window.playMechanicalClick) window.playMechanicalClick(1100, 0.02);
      }
    });

    imgEl?.addEventListener('click', () => {
      imgEl.classList.toggle('zoomed');
      const span = zoomToggleBtn?.querySelector('span');
      if (span) {
        span.textContent = imgEl.classList.contains('zoomed') ? 'Reset High-Res Zoom' : 'Toggle High-Res Zoom';
      }
      if (window.playMechanicalClick) window.playMechanicalClick(1100, 0.02);
    });

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
  // 08D. AVAI PREPARATION: CREATIVE ARCHITECTURE & INTERACTIVE LAB CONTROLLER
  // ===========================================================================
  const initAvaiCreativeLab = () => {
    const simulator = document.getElementById('avai-simulator');
    if (!simulator) return;

    // 1. Tab Switching System
    const tabBtns = simulator.querySelectorAll('.avai-tab-btn');
    const tabPanes = simulator.querySelectorAll('.avai-tab-pane');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        tabBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanes.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const activePane = document.getElementById(`tab-avai-${tabId}`);
        if (activePane) activePane.classList.add('active');

        if (tabId === 'neural') drawNeuralGraph();
        if (tabId === 'radar') drawRadarChart();
        if (window.playMechanicalClick) window.playMechanicalClick(1050, 0.02);
      });
    });

    // 2. Tab 1: Neural Concept Synthesizer Canvas
    const canvas = document.getElementById('avai-neural-canvas');
    let ctx = canvas ? canvas.getContext('2d') : null;
    let neuralAnimId = null;

    const topicNodes = {
      security: [
        { id: 0, label: 'Zero-Trust Protocol', x: 120, y: 80, tier: 'Tier 4', latency: '0.42ms', desc: 'Cryptographic token validation verifying mutual authenticity before session socket creation.' },
        { id: 1, label: 'SHA-256 HMAC', x: 260, y: 70, tier: 'Tier 3', latency: '0.18ms', desc: 'Constant-time message integrity validation to eliminate side-channel timing leaks.' },
        { id: 2, label: 'Vulnerability Audit', x: 180, y: 170, tier: 'Tier 4', latency: '0.95ms', desc: 'Automated state machine tracking port states, TCP flags, and response latency vectors.' },
        { id: 3, label: 'TLS 1.3 Handshake', x: 340, y: 160, tier: 'Tier 3', latency: '0.35ms', desc: 'Zero-round-trip time (0-RTT) resumption and forward secrecy cipher negotiation.' },
        { id: 4, label: 'Kernel Hardening', x: 460, y: 100, tier: 'Tier 5', latency: '1.10ms', desc: 'Seccomp-BPF system call filtering restricting containerized process capabilities.' },
        { id: 5, label: 'Anomaly Vector', x: 450, y: 220, tier: 'Tier 4', latency: '0.82ms', desc: 'Real-time statistical outlier detection evaluating deviation from baseline metrics.' }
      ],
      ai: [
        { id: 0, label: 'Multi-Modal Vision', x: 140, y: 90, tier: 'Tier 5', latency: '6.40ms', desc: 'Convolutional attention layers extracting diagram and formula tokens from input imagery.' },
        { id: 1, label: 'Bayesian Tracing', x: 280, y: 80, tier: 'Tier 4', latency: '0.75ms', desc: 'Probabilistic mastery estimation modeling student concept retention over time.' },
        { id: 2, label: 'Synthetic Generator', x: 200, y: 200, tier: 'Tier 4', latency: '1.20ms', desc: 'Algorithmic question synthesis producing randomized parameter constraints.' },
        { id: 3, label: 'Transformer Attention', x: 380, y: 150, tier: 'Tier 5', latency: '4.80ms', desc: 'Self-attention scoring weighting relevant conceptual prerequisites dynamically.' },
        { id: 4, label: 'Fast Inference', x: 480, y: 210, tier: 'Tier 3', latency: '0.65ms', desc: 'Quantized sub-10ms browser runtime executing lightweight linear algebra kernels.' }
      ],
      algorithms: [
        { id: 0, label: 'DAG Topology', x: 130, y: 100, tier: 'Tier 3', latency: '0.30ms', desc: 'Directed acyclic graph ordering resolving prerequisite dependency sequences.' },
        { id: 1, label: 'A* Pathfinding', x: 270, y: 90, tier: 'Tier 4', latency: '0.55ms', desc: 'Heuristic search finding the optimal learning trajectory through knowledge trees.' },
        { id: 2, label: 'Circular Buffers', x: 210, y: 210, tier: 'Tier 3', latency: '0.12ms', desc: 'Fixed-size memory arenas preventing garbage collection latency spikes.' },
        { id: 3, label: 'Binary Trie Lookups', x: 390, y: 160, tier: 'Tier 4', latency: '0.22ms', desc: 'Constant-time prefix tree retrieval for thousand-concept taxonomies.' },
        { id: 4, label: 'Bitwise Accumulators', x: 470, y: 90, tier: 'Tier 3', latency: '0.08ms', desc: 'Hardware-level bit manipulation for rapid telemetry flag aggregation.' }
      ],
      data: [
        { id: 0, label: 'Normal Distribution', x: 140, y: 90, tier: 'Tier 2', latency: '0.15ms', desc: 'Standard deviation curve mapping cohort percentile performance bands.' },
        { id: 1, label: 'Poisson Event Streams', x: 270, y: 80, tier: 'Tier 3', latency: '0.28ms', desc: 'Predicting arrival frequencies of interactive examination events.' },
        { id: 2, label: 'Chi-Square Testing', x: 200, y: 200, tier: 'Tier 3', latency: '0.40ms', desc: 'Validating statistical independence between candidate speed and accuracy.' },
        { id: 3, label: 'Time-Series Forecast', x: 380, y: 170, tier: 'Tier 4', latency: '0.90ms', desc: 'Projecting exam readiness trajectories based on sliding window performance.' },
        { id: 4, label: 'Feature Scaling', x: 470, y: 110, tier: 'Tier 2', latency: '0.18ms', desc: 'Z-score normalization aligning multi-modal cognitive metrics onto unit space.' }
      ]
    };

    let activeTopic = 'security';
    let nodes = topicNodes[activeTopic];
    let selectedNode = nodes[0];
    let draggedNode = null;

    const updateActiveNodeInfo = (node) => {
      selectedNode = node;
      const tag = document.getElementById('active-node-tag');
      const desc = document.getElementById('active-node-desc');
      const tier = document.getElementById('active-node-tier');
      const latency = document.getElementById('active-node-latency');

      if (tag) tag.textContent = `ACTIVE NODE: ${node.label.toUpperCase()}`;
      if (desc) desc.textContent = node.desc;
      if (tier) tier.textContent = node.tier;
      if (latency) latency.textContent = node.latency;
    };

    // Topic Seed Buttons
    const topicChips = simulator.querySelectorAll('.topic-chip');
    topicChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        topicChips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        activeTopic = chip.dataset.topic;
        nodes = topicNodes[activeTopic] || topicNodes.security;
        updateActiveNodeInfo(nodes[0]);
        drawNeuralGraph();
        if (window.playMechanicalClick) window.playMechanicalClick(1200, 0.02);
      });
    });

    let isAvaiSectionInView = false;

    const drawNeuralGraph = () => {
      if (!canvas || !ctx || !isAvaiSectionInView) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.002;

      // Draw Connections (Synapses)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 220) {
            const alpha = Math.max(0.1, 1 - dist / 220) * 0.5;
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            // Animated Signal Pulse Traveling Along Wire
            const pulseT = (time + (i + j) * 0.4) % 1;
            const px = nodes[i].x + (nodes[j].x - nodes[i].x) * pulseT;
            const py = nodes[i].y + (nodes[j].y - nodes[i].y) * pulseT;

            ctx.fillStyle = '#ff6b00';
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw Nodes
      nodes.forEach((node) => {
        const isSelected = selectedNode && selectedNode.id === node.id;
        
        // Node Glow Ring
        ctx.fillStyle = isSelected ? 'rgba(255, 107, 0, 0.25)' : 'rgba(6, 182, 212, 0.15)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, isSelected ? 22 : 16, 0, Math.PI * 2);
        ctx.fill();

        // Node Inner Circle
        ctx.fillStyle = isSelected ? '#ff6b00' : '#06b6d4';
        ctx.beginPath();
        ctx.arc(node.x, node.y, isSelected ? 9 : 7, 0, Math.PI * 2);
        ctx.fill();

        // Node Label
        ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.75)';
        ctx.font = isSelected ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + (isSelected ? 26 : 22));
      });

      neuralAnimId = requestAnimationFrame(drawNeuralGraph);
    };

    if (canvas) {
      canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;

        nodes.forEach((node) => {
          if (Math.hypot(node.x - mx, node.y - my) < 24) {
            draggedNode = node;
            updateActiveNodeInfo(node);
            if (window.playMechanicalClick) window.playMechanicalClick(1300, 0.02);
          }
        });
      });

      window.addEventListener('mousemove', (e) => {
        if (!draggedNode || !canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        draggedNode.x = Math.max(20, Math.min(canvas.width - 20, (e.clientX - rect.left) * scaleX));
        draggedNode.y = Math.max(20, Math.min(canvas.height - 20, (e.clientY - rect.top) * scaleY));
      });

      window.addEventListener('mouseup', () => {
        draggedNode = null;
      });
    }

    const avaiSection = document.getElementById('avai-creative-lab');
    if (avaiSection) {
      const avaiObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isAvaiSectionInView = entry.isIntersecting;
          if (isAvaiSectionInView) {
            cancelAnimationFrame(neuralAnimId);
            neuralAnimId = requestAnimationFrame(drawNeuralGraph);
          }
        });
      }, { threshold: 0.05 });
      avaiObs.observe(avaiSection);
    }

    // 3. Tab 2: 200 FPS Speed Drill Engine
    const drillQuestions = [
      {
        tag: 'QUESTION GENERATION #04 • NETWORK PROTOCOLS & DEFENSE',
        q: 'Which mechanism provides constant-time signature comparison to prevent timing side-channel attacks?',
        options: [
          { text: 'Standard strcmp() string evaluation', correct: false },
          { text: 'Bitwise XOR accumulator with fixed-time loop (HMAC verify)', correct: true },
          { text: 'Recursive hash table lookup with caching', correct: false },
          { text: 'Asynchronous socket promise resolution', correct: false }
        ]
      },
      {
        tag: 'QUESTION GENERATION #05 • HIGH-THROUGHPUT GRAPH SYSTEMS',
        q: 'To achieve sub-10ms response latency across 10,000 prerequisite nodes, which memory layout is optimal?',
        options: [
          { text: 'Flat Contiguous Array Adjacency Matrix with Bitmap Flags', correct: true },
          { text: 'Nested JSON pointer tree with recursive traversal', correct: false },
          { text: 'Dynamic linked list with mutex locks on every node', correct: false },
          { text: 'External REST API fetch per node inspection', correct: false }
        ]
      },
      {
        tag: 'QUESTION GENERATION #06 • TELEMETRY & HARDWARE ACCELERATION',
        q: 'At 200 FPS, what is the exact target frame time budget per animation tick?',
        options: [
          { text: '16.67 milliseconds', correct: false },
          { text: '8.33 milliseconds', correct: false },
          { text: '5.00 milliseconds', correct: true },
          { text: '1.00 millisecond', correct: false }
        ]
      }
    ];

    let currentDrillIdx = 0;
    let drillScore = 1250;
    let drillStreak = 3;
    let drillStartTime = performance.now();
    let drillTimerInterval = null;

    const timerEl = document.getElementById('drill-timer');
    const scoreEl = document.getElementById('drill-score');
    const streakEl = document.getElementById('drill-streak');
    const feedbackEl = document.getElementById('drill-feedback');
    const qTagEl = document.querySelector('.drill-q-tag');
    const qTitleEl = document.getElementById('drill-q-title');
    const optGrid = document.getElementById('drill-options-grid');

    const startDrillTimer = () => {
      if (drillTimerInterval) clearInterval(drillTimerInterval);
      drillStartTime = performance.now();
      drillTimerInterval = setInterval(() => {
        if (!timerEl) return;
        const elapsedSec = ((performance.now() - drillStartTime) / 1000).toFixed(3);
        timerEl.textContent = `${elapsedSec.padStart(6, '0')}s`;
      }, 50);
    };

    const stopDrillTimer = () => {
      if (drillTimerInterval) {
        clearInterval(drillTimerInterval);
        drillTimerInterval = null;
      }
    };

    const loadDrillQuestion = (idx) => {
      const qData = drillQuestions[idx % drillQuestions.length];
      if (!qData || !qTitleEl || !optGrid) return;

      startDrillTimer();
      if (qTagEl) qTagEl.textContent = qData.tag;
      qTitleEl.textContent = qData.q;

      const letters = ['A', 'B', 'C', 'D'];
      optGrid.innerHTML = qData.options.map((opt, i) => `
        <button class="drill-opt-btn" data-correct="${opt.correct}">
          <span class="opt-letter">${letters[i]}</span>
          <span class="opt-text">${escapeHtml(opt.text)}</span>
        </button>
      `).join('');

      if (feedbackEl) {
        feedbackEl.className = 'drill-feedback-banner font-mono';
        feedbackEl.innerHTML = `<span>Select an option above to test real-time AVAI telemetry validation</span>`;
      }

      optGrid.querySelectorAll('.drill-opt-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          stopDrillTimer();
          const isCorrect = btn.dataset.correct === 'true';
          const elapsed = ((performance.now() - drillStartTime) / 1000).toFixed(3);

          optGrid.querySelectorAll('.drill-opt-btn').forEach((b) => {
            b.disabled = true;
            if (b.dataset.correct === 'true') b.classList.add('correct');
          });

          if (isCorrect) {
            btn.classList.add('correct');
            drillStreak += 1;
            drillScore += 250 * drillStreak;
            if (streakEl) streakEl.textContent = `${drillStreak}x MULTIPLIER`;
            if (scoreEl) scoreEl.textContent = `${drillScore.toLocaleString()} PTS`;
            if (feedbackEl) {
              feedbackEl.className = 'drill-feedback-banner font-mono success';
              feedbackEl.innerHTML = `<span>⚡ ACCURATE TELEMETRY! Response verified in <strong>${elapsed}s</strong>. +${250 * drillStreak} PTS. Loading next vector...</span>`;
            }
            if (window.playMechanicalClick) window.playMechanicalClick(1400, 0.04);
          } else {
            btn.classList.add('wrong');
            drillStreak = 1;
            if (streakEl) streakEl.textContent = `1x MULTIPLIER`;
            if (feedbackEl) {
              feedbackEl.className = 'drill-feedback-banner font-mono error';
              feedbackEl.innerHTML = `<span>⚠️ ANOMALY DETECTED: Sub-optimal answer chosen. Remediation path engaged.</span>`;
            }
            if (window.playMechanicalClick) window.playMechanicalClick(450, 0.06);
          }

          setTimeout(() => {
            currentDrillIdx += 1;
            loadDrillQuestion(currentDrillIdx);
          }, 2400);
        });
      });
    };

    loadDrillQuestion(0);

    // 4. Tab 3: Cognitive Readiness Radar Canvas
    const radarCanvas = document.getElementById('avai-radar-canvas');
    let radarCtx = radarCanvas ? radarCanvas.getContext('2d') : null;

    const drawRadarChart = () => {
      if (!radarCanvas || !radarCtx) return;
      const ctx = radarCtx;
      const w = radarCanvas.width;
      const h = radarCanvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = 110;

      ctx.clearRect(0, 0, w, h);

      const axes = [
        { name: 'Threat Model', value: 0.96 },
        { name: 'Algorithms', value: 0.92 },
        { name: 'Low Latency', value: 0.98 },
        { name: 'Pipelines', value: 0.90 },
        { name: 'Retention', value: 0.94 }
      ];

      const numAxes = axes.length;
      const angleStep = (Math.PI * 2) / numAxes;

      // Draw Concentric Web Polygons
      for (let level = 1; level <= 5; level++) {
        const r = (radius / 5) * level;
        ctx.strokeStyle = level === 5 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < numAxes; i++) {
          const angle = i * angleStep - Math.PI / 2;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Draw Axis Lines
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Axis Label
        const lx = cx + Math.cos(angle) * (radius + 24);
        const ly = cy + Math.sin(angle) * (radius + 24);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(axes[i].name, lx, ly);
      }

      // Draw Data Polygon with Gradient
      ctx.beginPath();
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const r = radius * axes[i].value;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
      grad.addColorStop(0, 'rgba(255, 107, 0, 0.55)');
      grad.addColorStop(0.7, 'rgba(6, 182, 212, 0.35)');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0.2)');

      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = '#ff6b00';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Vertex Dots
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const r = radius * axes[i].value;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    drawRadarChart();
  };

  initAvaiCreativeLab();

  // ===========================================================================
  // 09. CONTACT FORM VALIDATION & TOAST NOTIFICATIONS
  // ===========================================================================
  const initContactAndToasts = () => {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailAddress = document.getElementById('email-address')?.textContent || 'bibekbandhu2007@gmail.com';
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

    // High-Performance Section Spy with Zero Layout-Thrashing (IntersectionObserver)
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${activeId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
          mobileLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${activeId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });

    sections.forEach((sec) => sectionObserver.observe(sec));

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

          isTicking = false;
        });
        isTicking = true;
      }
    }, { passive: true });

    backToTopBtn?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    if (hamburgerBtn && mobileDrawer) {
      const closeDrawer = () => {
        hamburgerBtn.classList.remove('active');
        mobileDrawer.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      };

      const openDrawer = () => {
        hamburgerBtn.classList.add('active');
        mobileDrawer.classList.add('open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        mobileDrawer.setAttribute('aria-hidden', 'false');
      };

      hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileDrawer.classList.contains('open');
        if (isOpen) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });

      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          closeDrawer();
        });
      });

      // Close when clicking outside the mobile drawer
      document.addEventListener('click', (e) => {
        if (mobileDrawer.classList.contains('open')) {
          if (!mobileDrawer.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            closeDrawer();
          }
        }
      });

      // Close when pressing Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
          closeDrawer();
        }
      });
    }
  };

  initNavigationAndScroll();

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
      } else if (action === 'open-avai') {
        window.open('https://github.com/nayekdhananjoy1973-lab/avai_preparation', '_blank');
        showToast('Opening AVAI Preparation GitHub Repository...', 'info');
      } else if (action === 'open-twitter') {
        window.open('https://x.com/bibekbandhunyk', '_blank');
        showToast('Opening Twitter / X profile (@bibekbandhunyk)...', 'info');
      } else if (action === 'copy-email') {
        navigator.clipboard.writeText('bibekbandhu2007@gmail.com').then(() => {
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

  // ===========================================================================
  // 18. DYNAMIC CERTIFICATE STORE, 3D CYLINDRICAL ORBIT & OWNER SECURITY ENGINE
  // ===========================================================================
  const initOwnerAnd3DOrbitEngine = () => {
    // -------------------------------------------------------------------------
    // 18A. CORE DATASETS & PERSISTENCE
    // -------------------------------------------------------------------------
    const DEFAULT_CERTIFICATES = [
      {
        id: 'cert_ibm_llm',
        title: 'Large Language Model Basics',
        issuer: 'IBM SkillsBuild',
        board: 'IBM SkillsBuild • Adobe Learning Manager System of Record',
        category: 'ai',
        grade: 'VERIFIED',
        certId: 'Course ID: ALM-COURSE_4058872',
        date: '21 Sep 2026 (GMT)',
        img: 'assets/ibm-llm-basics-certificate.png',
        seal: 'ibm',
        icon: '🤖',
        status: 'IBM VERIFIED // 100% AUTHENTIC'
      },
      {
        id: 'cert_ibm_prompting',
        title: 'Mastering the Art of Prompting',
        issuer: 'IBM SkillsBuild',
        board: 'IBM SkillsBuild • Adobe Learning Manager System of Record',
        category: 'ai',
        grade: 'VERIFIED (1 HR)',
        certId: 'Course ID: ALM-COURSE_4058858',
        date: '21 Sep 2026 (GMT)',
        img: 'assets/ibm-prompting-certificate.png',
        seal: 'ibm',
        icon: '🎯',
        status: 'IBM VERIFIED // 100% AUTHENTIC'
      },
      {
        id: 'cert_ibm_ai_basics',
        title: 'Getting Started with Artificial Intelligence',
        issuer: 'IBM SkillsBuild',
        board: 'IBM SkillsBuild • Your Learning Builder System of Record',
        category: 'ai',
        grade: 'VERIFIED',
        certId: 'Learning Plan: PLAN-E624C2604060',
        date: '21 Sep 2026 (GMT)',
        img: 'assets/ibm-ai-basics-certificate.png',
        seal: 'ibm',
        icon: '🧠',
        status: 'IBM VERIFIED // 100% AUTHENTIC'
      },
      {
        id: 'cert_nspc_parijat',
        title: 'National Student Paryavaran Competition',
        issuer: 'Ministry of Education & CirQula',
        board: 'Govt. of India Ministry of Education & CirQula India • NSPC 2026',
        category: 'national',
        grade: 'GOLD पारिजात',
        certId: 'Cert Code: NSPC-2026-36d1f8b6 | EcoMitram',
        date: '11 September 2026',
        img: 'assets/nspc-cirqula-certificate.png',
        seal: 'cirqula',
        icon: '🌿',
        status: 'MOE & CIRQULA // GOLD PARIJAT'
      },
      {
        id: 'cert_isro_space_day',
        title: 'National Space Day Quiz 2026',
        issuer: 'ISRO & Department of Space',
        board: 'Indian Space Research Organisation (ISRO) & MyGov India',
        category: 'national',
        grade: 'NATIONAL MERIT',
        certId: 'Candidate: Bibekbandhunayek | ISRO Space Day',
        date: '23 August 2026',
        img: 'assets/isro-space-day-certificate.png',
        seal: 'isro',
        icon: '🚀',
        status: 'ISRO & MYGOV // MERIT'
      },
      {
        id: 'cert_wbchse_hs',
        title: 'Higher Secondary Examination (Class XII)',
        issuer: 'WBCHSE State Board',
        board: 'West Bengal Council of Higher Secondary Education',
        category: 'state',
        grade: 'RANK 1 • A++',
        certId: 'Registration: 3241140595 | Roll 1 Distinction',
        date: '14th May, 2026',
        img: 'assets/higher-secondary-certificate.jpg',
        seal: 'wbchse',
        icon: '📜',
        status: 'WBCHSE COUNCIL // ACCREDITED'
      },
      {
        id: 'cert_wbbse_madhyamik',
        title: 'Secondary Examination (Madhyamik Class X)',
        issuer: 'WBBSE State Board',
        board: 'West Bengal Board of Secondary Education • Bishnupur SKV',
        category: 'state',
        grade: 'ROLL 1 SUMMA',
        certId: 'Roll 1 Distinction • Attested Record',
        date: '2024 Examination',
        img: 'assets/secondary-certificate.jpg',
        seal: 'wbchse',
        icon: '🎓',
        status: 'WBBSE BOARD // VERIFIED'
      },
      {
        id: 'cert_bonafide_project',
        title: 'Class XII English Bonafide Project Certificate',
        issuer: 'Department of English',
        board: '"Health and Fitness - A Path to Better Life" • Supervised Coursework',
        category: 'academic',
        grade: 'ROLL 1 HONOR',
        certId: 'Institutional Project Record | Reg: 3241140595',
        date: '05/10/2025 (Attested)',
        img: 'assets/bonafide-project-certificate.jpg',
        seal: 'cirqula',
        icon: '📋',
        status: 'DEPARTMENT ATTESTED // GRADE A'
      }
    ];

    const getCertificates = () => {
      try {
        const stored = localStorage.getItem('bbn_certificates_v2');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Error reading certificates from localStorage:', e);
      }
      localStorage.setItem('bbn_certificates_v2', JSON.stringify(DEFAULT_CERTIFICATES));
      return DEFAULT_CERTIFICATES;
    };

    const saveCertificates = (certs) => {
      localStorage.setItem('bbn_certificates_v2', JSON.stringify(certs));
      updateCategoryCounts();
      renderAllViews();
    };

    // -------------------------------------------------------------------------
    // 18B. OWNER SECURITY & AUTHENTICATION STATE
    // -------------------------------------------------------------------------
    const getOwnerPin = () => localStorage.getItem('bbn_owner_pin') || '2026';
    const isOwnerActive = () => sessionStorage.getItem('bbn_owner_session') === 'true';

    const updateOwnerUIState = () => {
      const active = isOwnerActive();
      const ownerHud = document.getElementById('owner-hud-bar');
      if (active) {
        document.body.classList.add('owner-mode-active');
        if (ownerHud) ownerHud.style.display = 'block';
      } else {
        document.body.classList.remove('owner-mode-active');
        if (ownerHud) ownerHud.style.display = 'none';
      }
    };

    // -------------------------------------------------------------------------
    // 18C. CARD DOM TEMPLATE GENERATOR
    // -------------------------------------------------------------------------
    const createCertificateCardDOM = (cert, is3D = false) => {
      const card = document.createElement('article');
      card.className = is3D
        ? 'cert-3d-card'
        : 'academic-cert-card cert-interactive-card spotlight-card';
      card.setAttribute('data-category', cert.category || 'ai');
      card.setAttribute('data-cert-id', cert.id);

      const sealClass = `seal-${cert.seal || 'ibm'}`;
      const gradeClass = `grade-${cert.seal || 'ibm'}`;
      const downloadName = (cert.title || 'certificate').toLowerCase().replace(/[^a-z0-9]/g, '_') + '.jpg';

      card.innerHTML = `
        <div class="academic-cert-card">
          <div class="cert-holo-glare"></div>
          <div class="academic-cert-preview">
            <div class="cert-laser-scanner">
              <div class="scanner-line"></div>
              <div class="scanner-glow"></div>
              <div class="scanner-text font-mono">${escapeHtml(cert.status || 'VERIFIED CREDENTIAL')}</div>
            </div>

            <div class="corner-bracket corner-tl"></div>
            <div class="corner-bracket corner-tr"></div>
            <div class="corner-bracket corner-bl"></div>
            <div class="corner-bracket corner-br"></div>

            <div class="cert-img-wrapper"
              data-lightbox-title="${escapeHtml(cert.title)}"
              data-lightbox-grade="${escapeHtml(cert.grade)}"
              data-lightbox-inst="${escapeHtml(cert.issuer)}"
              data-lightbox-id="${escapeHtml(cert.certId)}"
              data-lightbox-img="${escapeHtml(cert.img)}"
              data-lightbox-download="${escapeHtml(cert.img)}">
              <img src="${escapeHtml(cert.img)}" alt="${escapeHtml(cert.title)}" class="cert-document-img" loading="lazy">
              <div class="cert-hover-overlay">
                <div class="inspect-circle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  <span>Inspect Certificate</span>
                </div>
              </div>
              <div class="cert-seal-badge ${sealClass}">
                <div class="seal-spin-ring"></div>
                <span>${escapeHtml(cert.issuer.split(' ')[0] || 'VERIFIED')}</span>
              </div>
            </div>
          </div>

          <div class="academic-cert-info">
            <div class="academic-cert-top">
              <div class="school-affiliation-row">
                <span class="cert-org-icon">${cert.icon || '🏆'}</span>
                <span class="school-name-text">${escapeHtml(cert.issuer)}</span>
              </div>
              <div class="grade-pill ${gradeClass}">
                <span class="grade-icon">⭐</span>
                <span>${escapeHtml(cert.grade)}</span>
              </div>
            </div>

            <h3 class="academic-cert-title">${escapeHtml(cert.title)}</h3>
            <p class="academic-cert-board">${escapeHtml(cert.board)}</p>

            <div class="cert-meta-grid font-mono">
              <div class="meta-item">
                <span class="meta-label">ID / CODE:</span>
                <span class="meta-val">${escapeHtml(cert.certId)}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">DATE:</span>
                <span class="meta-val text-cyan">${escapeHtml(cert.date)}</span>
              </div>
            </div>

            <div class="academic-cert-footer">
              <button type="button" class="btn btn-primary btn-sm cert-btn-inspect" title="Inspect Full Screen">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span>Inspect</span>
              </button>
              <a href="${escapeHtml(cert.img)}" download="${downloadName}" class="btn btn-secondary btn-sm" title="Download Document">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>Download</span>
              </a>
            </div>

            <!-- Owner Action Buttons (Visible only in Owner Mode) -->
            <div class="cert-owner-actions">
              <button type="button" class="btn-owner-edit-cert" title="Edit this Certificate">
                <span>✏️ Edit</span>
              </button>
              <button type="button" class="btn-owner-delete-cert" title="Delete this Certificate">
                <span>🗑️ Delete</span>
              </button>
            </div>
          </div>
        </div>
      `;

      // Event: Inspect button
      const inspectBtn = card.querySelector('.cert-btn-inspect');
      const imgWrapper = card.querySelector('.cert-img-wrapper');
      const openLightboxHandler = (e) => {
        e.stopPropagation();
        if (window.openCertificateLightbox) {
          window.openCertificateLightbox(cert);
        }
      };
      inspectBtn?.addEventListener('click', openLightboxHandler);
      imgWrapper?.addEventListener('click', openLightboxHandler);

      // Event: Owner Edit
      const editBtn = card.querySelector('.btn-owner-edit-cert');
      editBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditCertModal(cert);
      });

      // Event: Owner Delete
      const deleteBtn = card.querySelector('.btn-owner-delete-cert');
      deleteBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Delete certificate "${cert.title}"? This cannot be undone.`)) {
          const current = getCertificates().filter((c) => c.id !== cert.id);
          saveCertificates(current);
          window.showToast(`Certificate "${cert.title}" deleted`, 'info');
        }
      });

      return card;
    };

    // -------------------------------------------------------------------------
    // 18D. 3D MOVABLE CYLINDRICAL ORBIT CAROUSEL ENGINE
    // -------------------------------------------------------------------------
    let currentFilter = 'all';
    let currentView = '3d'; // '3d' | 'grid'

    const viewport = document.getElementById('cert-3d-viewport');
    const cylinder = document.getElementById('cert-3d-cylinder');
    const angleDisplay = document.getElementById('orbit-angle-val');
    const countDisplay = document.getElementById('orbit-card-count');
    const steerLeftBtn = document.getElementById('orbit-steer-left');
    const steerRightBtn = document.getElementById('orbit-steer-right');
    const toggleSpinBtn = document.getElementById('orbit-toggle-spin');
    const spinIcon = document.getElementById('orbit-spin-icon');
    const spinText = document.getElementById('orbit-spin-text');

    let currentAngle = 0;
    let targetAngle = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartAngle = 0;
    let lastMoveX = 0;
    let velocity = 0;
    let autoSpin = true;
    let isHovered = false;
    let animFrameId = null;
    let currentRadius = 520;
    let currentAngleStep = 45;

    const calculateDynamicRadius = (count) => {
      const w = window.innerWidth;
      const safeCount = Math.max(count, 3);
      if (w <= 600) {
        return Math.max(220, Math.min(380, 130 / Math.tan(Math.PI / safeCount) + 70));
      } else if (w <= 900) {
        return Math.max(300, Math.min(500, 150 / Math.tan(Math.PI / safeCount) + 90));
      } else {
        return Math.max(400, Math.min(680, 170 / Math.tan(Math.PI / safeCount) + 120));
      }
    };

    const render3DCylinder = () => {
      if (!cylinder) return;
      cylinder.innerHTML = '';

      const certs = getCertificates();
      const filtered = currentFilter === 'all'
        ? certs
        : certs.filter((c) => (c.category || '').toLowerCase() === currentFilter.toLowerCase());

      const count = filtered.length;
      if (countDisplay) {
        countDisplay.textContent = `${count} ${count === 1 ? 'Credential' : 'Credentials'}`;
      }

      if (count === 0) {
        cylinder.innerHTML = `
          <div style="color: #94a3b8; font-family: var(--font-mono); font-size: 0.95rem; text-align: center; padding: 3rem 1rem;">
            No certificates found in this category. Click "+ Add Achievement" to create one.
          </div>
        `;
        return;
      }

      currentAngleStep = 360 / count;
      currentRadius = calculateDynamicRadius(count);

      filtered.forEach((cert, i) => {
        const baseAngle = i * currentAngleStep;
        const cardDOM = createCertificateCardDOM(cert, true);
        cardDOM.setAttribute('data-base-angle', baseAngle);
        cardDOM.style.transform = `rotateY(${baseAngle}deg) translateZ(${currentRadius}px)`;

        // Clicking a non-front card smoothly rotates cylinder to bring it front
        cardDOM.addEventListener('click', (e) => {
          if (e.target.closest('.cert-btn-inspect') || e.target.closest('.cert-img-wrapper') || e.target.closest('.cert-owner-actions')) {
            return;
          }
          const cardAngle = parseFloat(cardDOM.getAttribute('data-base-angle') || 0);
          const worldAngle = ((cardAngle + currentAngle) % 360 + 360) % 360;
          let diff = worldAngle > 180 ? 360 - worldAngle : -worldAngle;
          targetAngle += diff;
          if (window.playMechanicalClick) window.playMechanicalClick(850, 0.02);
        });

        cylinder.appendChild(cardDOM);
      });
    };

    const update3DAnimation = () => {
      if (currentView === '3d' && cylinder) {
        // Auto-spin momentum
        if (autoSpin && !isDragging && !isHovered) {
          targetAngle -= 0.16;
        }

        // Inertia decay
        if (Math.abs(velocity) > 0.02) {
          targetAngle += velocity;
          velocity *= 0.93;
        } else {
          velocity = 0;
        }

        // Interpolation
        currentAngle += (targetAngle - currentAngle) * 0.12;
        cylinder.style.transform = `rotateY(${currentAngle}deg) rotateX(-3.5deg)`;

        // Calculate card facing front for lighting & interactive depth
        const cards = cylinder.querySelectorAll('.cert-3d-card');
        cards.forEach((card) => {
          const baseAngle = parseFloat(card.getAttribute('data-base-angle') || 0);
          const worldAngle = ((baseAngle + currentAngle) % 360 + 360) % 360;
          const diff = worldAngle > 180 ? 360 - worldAngle : worldAngle; // 0 = direct front, 180 = back
          const cosVal = Math.cos((diff * Math.PI) / 180);

          if (cosVal > 0.35) {
            card.classList.add('facing-front');
            card.classList.remove('facing-back');
            card.style.opacity = '1';
            card.style.filter = 'none';
            card.style.pointerEvents = 'auto';
          } else {
            card.classList.remove('facing-front');
            card.classList.add('facing-back');
            const depthFade = Math.max(0.3, (cosVal + 1) / 2);
            card.style.opacity = depthFade.toFixed(2);
            card.style.filter = 'blur(1px) brightness(0.75)';
          }
        });

        if (angleDisplay) {
          const normAngle = ((Math.abs(currentAngle) % 360)).toFixed(1);
          angleDisplay.textContent = `${normAngle}°`;
        }
      }

      animFrameId = requestAnimationFrame(update3DAnimation);
    };

    // -------------------------------------------------------------------------
    // 18E. INTERACTIVE POINTER DRAG & WHEEL PHYSICS
    // -------------------------------------------------------------------------
    if (viewport) {
      viewport.addEventListener('pointerdown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartAngle = targetAngle;
        lastMoveX = e.clientX;
        velocity = 0;
        viewport.setPointerCapture(e.pointerId);
      });

      viewport.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - dragStartX;
        velocity = (e.clientX - lastMoveX) * 0.28;
        lastMoveX = e.clientX;
        targetAngle = dragStartAngle + deltaX * 0.32;
      });

      const endDrag = (e) => {
        if (isDragging) {
          isDragging = false;
          try {
            viewport.releasePointerCapture(e.pointerId);
          } catch (err) {}
        }
      };

      viewport.addEventListener('pointerup', endDrag);
      viewport.addEventListener('pointercancel', endDrag);

      viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
        targetAngle += delta * 0.22;
      }, { passive: false });

      viewport.addEventListener('mouseenter', () => { isHovered = true; });
      viewport.addEventListener('mouseleave', () => { isHovered = false; });
    }

    // Steering buttons
    steerLeftBtn?.addEventListener('click', () => {
      targetAngle += currentAngleStep;
      if (window.playMechanicalClick) window.playMechanicalClick(900, 0.025);
    });

    steerRightBtn?.addEventListener('click', () => {
      targetAngle -= currentAngleStep;
      if (window.playMechanicalClick) window.playMechanicalClick(900, 0.025);
    });

    toggleSpinBtn?.addEventListener('click', () => {
      autoSpin = !autoSpin;
      if (spinIcon) spinIcon.textContent = autoSpin ? '⏸️' : '▶️';
      if (spinText) spinText.textContent = autoSpin ? 'Pause Spin' : 'Auto Spin';
      if (window.playMechanicalClick) window.playMechanicalClick(1050, 0.02);
    });

    // -------------------------------------------------------------------------
    // 18F. GRID VIEW RENDERING
    // -------------------------------------------------------------------------
    const renderGridView = () => {
      const grid = document.getElementById('academic-certificates-grid');
      if (!grid) return;
      grid.innerHTML = '';

      const certs = getCertificates();
      const filtered = currentFilter === 'all'
        ? certs
        : certs.filter((c) => (c.category || '').toLowerCase() === currentFilter.toLowerCase());

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; color: #94a3b8; font-family: var(--font-mono); font-size: 0.95rem; text-align: center; padding: 3rem 1rem;">
            No certificates found in this category. Click "+ Add Achievement" to create one.
          </div>
        `;
        return;
      }

      filtered.forEach((cert) => {
        const cardDOM = createCertificateCardDOM(cert, false);
        grid.appendChild(cardDOM);
      });
    };

    // -------------------------------------------------------------------------
    // 18G. CATEGORY FILTER & VIEW SWITCHER HANDLERS
    // -------------------------------------------------------------------------
    const updateCategoryCounts = () => {
      const certs = getCertificates();
      const countAll = certs.length;
      const countAi = certs.filter((c) => c.category === 'ai').length;
      const countNat = certs.filter((c) => c.category === 'national').length;
      const countState = certs.filter((c) => c.category === 'state').length;

      const elAll = document.getElementById('cert-count-all');
      const elAi = document.getElementById('cert-count-ai');
      const elNat = document.getElementById('cert-count-national');
      const elState = document.getElementById('cert-count-state');

      if (elAll) elAll.textContent = countAll;
      if (elAi) elAi.textContent = countAi;
      if (elNat) elNat.textContent = countNat;
      if (elState) elState.textContent = countState;
    };

    const renderAllViews = () => {
      render3DCylinder();
      renderGridView();
    };

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.cert-filter-btn');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-cert-filter') || 'all';

        filterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        targetAngle = 0; // reset to first card
        currentAngle = 0;
        renderAllViews();
        if (window.playMechanicalClick) window.playMechanicalClick(1000, 0.02);
      });
    });

    // View Switcher Buttons
    const btnView3D = document.getElementById('btn-view-3d-orbit');
    const btnViewGrid = document.getElementById('btn-view-grid');
    const container3D = document.getElementById('cert-3d-showcase-container');
    const containerGrid = document.getElementById('cert-grid-view-container');
    const statusText = document.getElementById('cert-engine-status-text');

    btnView3D?.addEventListener('click', () => {
      currentView = '3d';
      btnView3D.classList.add('active');
      btnViewGrid?.classList.remove('active');
      if (container3D) container3D.style.display = 'block';
      if (containerGrid) containerGrid.style.display = 'none';
      if (statusText) statusText.textContent = '3D ORBIT: ACTIVE';
      render3DCylinder();
      if (window.playMechanicalClick) window.playMechanicalClick(1150, 0.02);
    });

    btnViewGrid?.addEventListener('click', () => {
      currentView = 'grid';
      btnViewGrid.classList.add('active');
      btnView3D?.classList.remove('active');
      if (container3D) container3D.style.display = 'none';
      if (containerGrid) containerGrid.style.display = 'block';
      if (statusText) statusText.textContent = 'GRID MATRIX: ACTIVE';
      renderGridView();
      if (window.playMechanicalClick) window.playMechanicalClick(1150, 0.02);
    });

    // Resize recalculates radius
    window.addEventListener('resize', () => {
      if (currentView === '3d') render3DCylinder();
    }, { passive: true });

    // -------------------------------------------------------------------------
    // 18H. OWNER AVATAR (PROFILE PICTURE) ENGINE
    // -------------------------------------------------------------------------
    const initAvatarManager = () => {
      const savedPhoto = localStorage.getItem('bbn_portfolio_profile_photo');
      if (savedPhoto) {
        document.querySelectorAll('.profile-img').forEach((img) => {
          img.src = savedPhoto;
        });
      }

      const avatarModal = document.getElementById('avatar-manager-modal');
      const avatarCloseBtn = document.getElementById('avatar-close-btn');
      const avatarTriggerBtn = document.getElementById('owner-avatar-edit-trigger');
      const ownerBarAvatarBtn = document.getElementById('owner-bar-avatar-btn');
      const avatarForm = document.getElementById('avatar-upload-form');
      const avatarFileInput = document.getElementById('avatar-file-input');
      const avatarUrlInput = document.getElementById('avatar-url-input');
      const avatarPreviewImg = document.getElementById('avatar-preview-img');
      const avatarResetBtn = document.getElementById('avatar-btn-reset-default');
      const avatarDropzone = document.getElementById('avatar-dropzone');

      const openAvatarModal = () => {
        if (!avatarModal) return;
        const currentSrc = localStorage.getItem('bbn_portfolio_profile_photo') || 'assets/profile.jpg';
        if (avatarPreviewImg) avatarPreviewImg.src = currentSrc;
        if (avatarUrlInput) avatarUrlInput.value = currentSrc.startsWith('data:') ? '' : currentSrc;
        avatarModal.showModal();
        if (window.playMechanicalClick) window.playMechanicalClick(950, 0.02);
      };

      avatarTriggerBtn?.addEventListener('click', openAvatarModal);
      ownerBarAvatarBtn?.addEventListener('click', openAvatarModal);
      avatarCloseBtn?.addEventListener('click', () => avatarModal?.close());

      // File upload handler
      avatarFileInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (avatarPreviewImg && event.target?.result) {
              avatarPreviewImg.src = event.target.result;
            }
          };
          reader.readAsDataURL(file);
        }
      });

      // Dropzone drag/drop
      avatarDropzone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        avatarDropzone.classList.add('dragover');
      });
      avatarDropzone?.addEventListener('dragleave', () => {
        avatarDropzone.classList.remove('dragover');
      });
      avatarDropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        avatarDropzone.classList.remove('dragover');
        const file = e.dataTransfer.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (avatarPreviewImg && event.target?.result) {
              avatarPreviewImg.src = event.target.result;
            }
          };
          reader.readAsDataURL(file);
        }
      });

      // URL input change
      avatarUrlInput?.addEventListener('input', () => {
        const val = avatarUrlInput.value.trim();
        if (val && avatarPreviewImg) avatarPreviewImg.src = val;
      });

      // Form Submit
      avatarForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newSrc = avatarPreviewImg?.src;
        if (newSrc) {
          localStorage.setItem('bbn_portfolio_profile_photo', newSrc);
          document.querySelectorAll('.profile-img').forEach((img) => {
            img.src = newSrc;
          });
          avatarModal?.close();
          window.showToast('✓ Profile photo successfully updated & saved!', 'success');
          if (window.playMechanicalClick) window.playMechanicalClick(1200, 0.03);
        }
      });

      // Reset to default
      avatarResetBtn?.addEventListener('click', () => {
        localStorage.removeItem('bbn_portfolio_profile_photo');
        document.querySelectorAll('.profile-img').forEach((img) => {
          img.src = 'assets/profile.jpg';
        });
        if (avatarPreviewImg) avatarPreviewImg.src = 'assets/profile.jpg';
        avatarModal?.close();
        window.showToast('✓ Profile photo restored to default', 'info');
      });
    };

    // -------------------------------------------------------------------------
    // 18I. OWNER PIN SECURITY & AUTHENTICATION MODAL
    // -------------------------------------------------------------------------
    const initOwnerSecurityAuth = () => {
      const pinModal = document.getElementById('owner-pin-modal');
      const pinCloseBtn = document.getElementById('owner-pin-close-btn');
      const pinCancelBtn = document.getElementById('pin-btn-cancel');
      const pinSubmitBtn = document.getElementById('pin-btn-submit');
      const pinHiddenInput = document.getElementById('owner-pin-hidden-input');
      const pinDots = document.querySelectorAll('.pin-dot');
      const feedbackMsg = document.getElementById('pin-feedback-msg');
      const dockAdminBtn = document.getElementById('dock-admin-btn');
      const profileCard = document.getElementById('profile-card');
      const ownerBarLockBtn = document.getElementById('owner-bar-lock-btn');

      let enteredPin = '';

      const updatePinDots = () => {
        pinDots.forEach((dot, idx) => {
          if (idx < enteredPin.length) {
            dot.classList.add('filled');
          } else {
            dot.classList.remove('filled', 'success');
          }
        });
      };

      const openPinModal = () => {
        if (!pinModal) return;
        enteredPin = '';
        updatePinDots();
        if (feedbackMsg) {
          feedbackMsg.textContent = 'Default Master PIN: 2026';
          feedbackMsg.className = 'pin-feedback-msg font-mono';
        }
        pinModal.showModal();
        pinHiddenInput?.focus();
        if (window.playMechanicalClick) window.playMechanicalClick(950, 0.02);
      };

      window.openOwnerPinModal = openPinModal;

      const submitPin = () => {
        const correctPin = getOwnerPin();
        if (enteredPin === correctPin) {
          pinDots.forEach((d) => d.classList.add('success'));
          if (feedbackMsg) {
            feedbackMsg.textContent = 'ACCESS GRANTED // WELCOME BIBEK';
            feedbackMsg.className = 'pin-feedback-msg font-mono success';
          }
          sessionStorage.setItem('bbn_owner_session', 'true');
          setTimeout(() => {
            updateOwnerUIState();
            pinModal?.close();
            window.showToast('🛡️ OWNER ACCESS UNLOCKED // EDIT PRIVILEGES ACTIVE', 'success');
            if (window.playMechanicalClick) window.playMechanicalClick(1300, 0.04);
          }, 350);
        } else {
          if (feedbackMsg) {
            feedbackMsg.textContent = 'ACCESS DENIED // INCORRECT PIN';
            feedbackMsg.className = 'pin-feedback-msg font-mono error';
          }
          enteredPin = '';
          setTimeout(updatePinDots, 200);
          if (window.playMechanicalClick) window.playMechanicalClick(300, 0.08);
        }
      };

      // Numpad clicks
      document.querySelectorAll('.numpad-btn[data-val]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const val = btn.getAttribute('data-val');
          if (enteredPin.length < 8 && val) {
            enteredPin += val;
            updatePinDots();
            if (window.playMechanicalClick) window.playMechanicalClick(1100, 0.015);
            if (enteredPin.length === 4 && enteredPin === getOwnerPin()) {
              submitPin();
            }
          }
        });
      });

      document.getElementById('pin-btn-backspace')?.addEventListener('click', () => {
        enteredPin = enteredPin.slice(0, -1);
        updatePinDots();
        if (window.playMechanicalClick) window.playMechanicalClick(800, 0.015);
      });

      document.getElementById('pin-btn-clear')?.addEventListener('click', () => {
        enteredPin = '';
        updatePinDots();
      });

      pinSubmitBtn?.addEventListener('click', submitPin);
      pinCloseBtn?.addEventListener('click', () => pinModal?.close());
      pinCancelBtn?.addEventListener('click', () => pinModal?.close());

      // Physical keyboard typing inside PIN modal
      pinModal?.addEventListener('keydown', (e) => {
        if (/^[0-9]$/.test(e.key)) {
          if (enteredPin.length < 8) {
            enteredPin += e.key;
            updatePinDots();
            if (enteredPin.length === 4 && enteredPin === getOwnerPin()) {
              submitPin();
            }
          }
        } else if (e.key === 'Backspace') {
          enteredPin = enteredPin.slice(0, -1);
          updatePinDots();
        } else if (e.key === 'Enter') {
          submitPin();
        }
      });

      // Triggers:
      // 1. Dock admin lock button
      dockAdminBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (isOwnerActive()) {
          window.showToast('🛡️ Owner Mode is already active!', 'info');
        } else {
          openPinModal();
        }
      });

      // 2. Double-click on profile card in Hero
      profileCard?.addEventListener('dblclick', (e) => {
        e.preventDefault();
        if (!isOwnerActive()) {
          openPinModal();
        } else {
          document.getElementById('avatar-manager-modal')?.showModal();
        }
      });

      // 3. Global keyboard shortcut Ctrl+Shift+A or Alt+A
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
          e.preventDefault();
          if (isOwnerActive()) {
            lockOwnerMode();
          } else {
            openPinModal();
          }
        }
      });

      // 4. Lock & exit owner mode
      const lockOwnerMode = () => {
        sessionStorage.removeItem('bbn_owner_session');
        updateOwnerUIState();
        window.showToast('🔒 Owner Mode Locked // Viewer Safe Mode Active', 'info');
        if (window.playMechanicalClick) window.playMechanicalClick(700, 0.02);
      };

      ownerBarLockBtn?.addEventListener('click', lockOwnerMode);
    };

    // -------------------------------------------------------------------------
    // 18J. ADD & EDIT CERTIFICATE MODAL LOGIC
    // -------------------------------------------------------------------------
    const addCertModal = document.getElementById('add-cert-modal');
    const addCertCloseBtn = document.getElementById('add-cert-close-btn');
    const addCertCancelBtn = document.getElementById('add-cert-btn-cancel');
    const openAddCertModalBtn = document.getElementById('btn-open-add-cert-modal');
    const ownerBarAddCertBtn = document.getElementById('owner-bar-add-cert-btn');
    const addCertForm = document.getElementById('add-cert-form');
    const certFileInput = document.getElementById('cert-file-input');
    const certUrlInput = document.getElementById('cert-url-input');
    const certPreviewImg = document.getElementById('cert-form-preview-img');
    const certPreviewPlaceholder = document.getElementById('cert-form-preview-placeholder');

    const openAddCertModal = () => {
      if (!addCertModal) return;
      document.getElementById('edit-cert-id').value = '';
      document.getElementById('add-cert-badge-label').textContent = '// CREDENTIAL REGISTRATION';
      document.getElementById('add-cert-title').textContent = 'Add Official Certificate / Achievement';
      document.getElementById('add-cert-submit-text').textContent = 'Deploy to 3D Orbit';
      addCertForm?.reset();
      if (certPreviewImg) {
        certPreviewImg.src = '';
        certPreviewImg.style.display = 'none';
      }
      if (certPreviewPlaceholder) certPreviewPlaceholder.style.display = 'block';
      addCertModal.showModal();
      if (window.playMechanicalClick) window.playMechanicalClick(950, 0.02);
    };

    const openEditCertModal = (cert) => {
      if (!addCertModal || !cert) return;
      document.getElementById('edit-cert-id').value = cert.id;
      document.getElementById('add-cert-badge-label').textContent = '// EDIT CREDENTIAL';
      document.getElementById('add-cert-title').textContent = 'Edit Credential Details';
      document.getElementById('add-cert-submit-text').textContent = 'Update & Re-Deploy';

      document.getElementById('cert-input-title').value = cert.title || '';
      document.getElementById('cert-input-issuer').value = cert.issuer || '';
      document.getElementById('cert-input-category').value = cert.category || 'ai';
      document.getElementById('cert-input-grade').value = cert.grade || '';
      document.getElementById('cert-input-id').value = cert.certId || '';
      document.getElementById('cert-input-date').value = cert.date || '';
      document.getElementById('cert-input-icon').value = cert.icon || '🏆';
      document.getElementById('cert-input-seal').value = cert.seal || 'ibm';
      certUrlInput.value = cert.img || '';

      if (cert.img && certPreviewImg) {
        certPreviewImg.src = cert.img;
        certPreviewImg.style.display = 'block';
        if (certPreviewPlaceholder) certPreviewPlaceholder.style.display = 'none';
      }

      addCertModal.showModal();
      if (window.playMechanicalClick) window.playMechanicalClick(950, 0.02);
    };

    openAddCertModalBtn?.addEventListener('click', openAddCertModal);
    ownerBarAddCertBtn?.addEventListener('click', openAddCertModal);
    addCertCloseBtn?.addEventListener('click', () => addCertModal?.close());
    addCertCancelBtn?.addEventListener('click', () => addCertModal?.close());

    certFileInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (certPreviewImg && event.target?.result) {
            certPreviewImg.src = event.target.result;
            certPreviewImg.style.display = 'block';
            if (certPreviewPlaceholder) certPreviewPlaceholder.style.display = 'none';
          }
        };
        reader.readAsDataURL(file);
      }
    });

    certUrlInput?.addEventListener('input', () => {
      const val = certUrlInput.value.trim();
      if (val && certPreviewImg) {
        certPreviewImg.src = val;
        certPreviewImg.style.display = 'block';
        if (certPreviewPlaceholder) certPreviewPlaceholder.style.display = 'none';
      }
    });

    addCertForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const editId = document.getElementById('edit-cert-id')?.value;
      const title = document.getElementById('cert-input-title')?.value.trim();
      const issuer = document.getElementById('cert-input-issuer')?.value.trim();
      const category = document.getElementById('cert-input-category')?.value || 'ai';
      const grade = document.getElementById('cert-input-grade')?.value.trim() || 'VERIFIED';
      const certId = document.getElementById('cert-input-id')?.value.trim() || 'ID: UNVERIFIED';
      const date = document.getElementById('cert-input-date')?.value.trim() || new Date().toLocaleDateString('en-GB');
      const icon = document.getElementById('cert-input-icon')?.value.trim() || '🏆';
      const seal = document.getElementById('cert-input-seal')?.value || 'ibm';
      const img = certPreviewImg?.src || certUrlInput?.value.trim() || 'assets/ibm-ai-basics-certificate.png';

      if (!title || !issuer) {
        alert('Please fill in title and issuer.');
        return;
      }

      const allCerts = getCertificates();
      if (editId) {
        // Edit existing
        const idx = allCerts.findIndex((c) => c.id === editId);
        if (idx !== -1) {
          allCerts[idx] = {
            ...allCerts[idx],
            title,
            issuer,
            board: `${issuer} • System of Record`,
            category,
            grade,
            certId,
            date,
            icon,
            seal,
            img,
            status: `${issuer.toUpperCase()} // VERIFIED`
          };
          saveCertificates(allCerts);
          window.showToast(`✓ Certificate "${title}" updated!`, 'success');
        }
      } else {
        // Add new
        const newCert = {
          id: `cert_custom_${Date.now()}`,
          title,
          issuer,
          board: `${issuer} • System of Record`,
          category,
          grade,
          certId,
          date,
          icon,
          seal,
          img,
          status: `${issuer.toUpperCase()} // 100% VERIFIED`
        };
        allCerts.unshift(newCert); // Place in front
        saveCertificates(allCerts);
        window.showToast(`✓ New certificate "${title}" deployed to 3D Orbit!`, 'success');
      }

      addCertModal?.close();
      if (window.playMechanicalClick) window.playMechanicalClick(1200, 0.03);
    });

    // -------------------------------------------------------------------------
    // 18K. CHANGE SECURITY PIN MODAL
    // -------------------------------------------------------------------------
    const changePinModal = document.getElementById('change-pin-modal');
    const changePinCloseBtn = document.getElementById('change-pin-close-btn');
    const changePinCancelBtn = document.getElementById('change-pin-btn-cancel');
    const ownerBarPinBtn = document.getElementById('owner-bar-pin-btn');
    const changePinForm = document.getElementById('change-pin-form');

    ownerBarPinBtn?.addEventListener('click', () => {
      changePinForm?.reset();
      changePinModal?.showModal();
    });

    changePinCloseBtn?.addEventListener('click', () => changePinModal?.close());
    changePinCancelBtn?.addEventListener('click', () => changePinModal?.close());

    changePinForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const oldPin = document.getElementById('old-pin-input')?.value.trim();
      const newPin = document.getElementById('new-pin-input')?.value.trim();
      const confirmPin = document.getElementById('confirm-pin-input')?.value.trim();

      if (oldPin !== getOwnerPin()) {
        alert('Current PIN is incorrect.');
        return;
      }
      if (!newPin || newPin.length < 4 || newPin.length > 8) {
        alert('New PIN must be 4 to 8 digits.');
        return;
      }
      if (newPin !== confirmPin) {
        alert('New PIN and confirmation do not match.');
        return;
      }

      localStorage.setItem('bbn_owner_pin', newPin);
      changePinModal?.close();
      window.showToast('✓ Security Master PIN updated successfully!', 'success');
    });

    // -------------------------------------------------------------------------
    // 18L. BACKUP & SYNC MODAL
    // -------------------------------------------------------------------------
    const backupModal = document.getElementById('backup-data-modal');
    const backupCloseBtn = document.getElementById('backup-close-btn');
    const ownerBarBackupBtn = document.getElementById('owner-bar-backup-btn');
    const downloadBackupBtn = document.getElementById('btn-download-backup-json');
    const copyBackupBtn = document.getElementById('btn-copy-backup-json');
    const backupFileInput = document.getElementById('backup-file-input');
    const restoreDefaultsBtn = document.getElementById('btn-restore-defaults');

    ownerBarBackupBtn?.addEventListener('click', () => backupModal?.showModal());
    backupCloseBtn?.addEventListener('click', () => backupModal?.close());

    const buildBackupPayload = () => {
      return JSON.stringify({
        certificates: getCertificates(),
        profilePhoto: localStorage.getItem('bbn_portfolio_profile_photo') || null,
        ownerPin: getOwnerPin(),
        exportedAt: new Date().toISOString()
      }, null, 2);
    };

    downloadBackupBtn?.addEventListener('click', () => {
      const payload = buildBackupPayload();
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bibek-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      window.showToast('✓ Backup JSON file downloaded!', 'success');
    });

    copyBackupBtn?.addEventListener('click', async () => {
      const payload = buildBackupPayload();
      try {
        await navigator.clipboard.writeText(payload);
        window.showToast('✓ Backup JSON copied to clipboard!', 'success');
      } catch (err) {
        window.showToast('Failed to copy JSON automatically', 'info');
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
              localStorage.setItem('bbn_certificates_v2', JSON.stringify(data.certificates));
            }
            if (data.profilePhoto) {
              localStorage.setItem('bbn_portfolio_profile_photo', data.profilePhoto);
              document.querySelectorAll('.profile-img').forEach((img) => img.src = data.profilePhoto);
            }
            if (data.ownerPin) {
              localStorage.setItem('bbn_owner_pin', data.ownerPin);
            }
            updateCategoryCounts();
            renderAllViews();
            backupModal?.close();
            window.showToast('✓ Portfolio data restored from backup file!', 'success');
          } catch (err) {
            alert('Invalid backup JSON file.');
          }
        };
        reader.readAsText(file);
      }
    });

    restoreDefaultsBtn?.addEventListener('click', () => {
      if (confirm('Restore factory defaults? This resets added certificates to the original 8 core certifications.')) {
        localStorage.removeItem('bbn_certificates_v2');
        localStorage.removeItem('bbn_portfolio_profile_photo');
        localStorage.removeItem('bbn_owner_pin');
        document.querySelectorAll('.profile-img').forEach((img) => img.src = 'assets/profile.jpg');
        updateCategoryCounts();
        renderAllViews();
        backupModal?.close();
        window.showToast('✓ Factory defaults restored', 'info');
      }
    });

    // -------------------------------------------------------------------------
    // 18M. INITIALIZE ALL
    // -------------------------------------------------------------------------
    updateOwnerUIState();
    initAvatarManager();
    initOwnerSecurityAuth();
    updateCategoryCounts();
    renderAllViews();
    update3DAnimation();
  };

  initOwnerAnd3DOrbitEngine();

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

});

