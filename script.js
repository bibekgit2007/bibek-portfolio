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
    const ctx = canvas.getContext('2d');
    
    let isMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
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

    const updateBeam = () => {
      if (window.innerWidth <= 768) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min(Math.max(scrollTop / scrollHeight, 0), 1) : 0;

      laserDot.style.top = `${(progress * 100).toFixed(2)}%`;

      if (activeLine) {
        const containerHeight = beamContainer.clientHeight || window.innerHeight;
        activeLine.setAttribute('y2', `${(progress * containerHeight).toFixed(1)}`);
      }
    };

    window.addEventListener('scroll', updateBeam, { passive: true });
    window.addEventListener('resize', updateBeam, { passive: true });
    updateBeam();
  };

  initTracingBeam();

  // ===========================================================================
  // 01C. 200 FPS MOTION LAB & VIDEO TELEMETRY ENGINE
  // ===========================================================================
  const initMotionLab = () => {
    const video = document.getElementById('motion-video');
    const videoStage = document.getElementById('motion-video-stage');
    const playBtn = document.getElementById('video-play-btn');
    const centerIndicator = document.getElementById('video-center-indicator');
    const playIcon = document.getElementById('video-play-icon');
    const centerIcon = document.getElementById('indicator-play-icon');
    const muteBtn = document.getElementById('video-mute-btn');
    const muteIcon = document.getElementById('video-mute-icon');
    const timeDisplay = document.getElementById('video-time');
    const durationDisplay = document.getElementById('video-duration');
    const scrubber = document.getElementById('video-scrubber');
    const speedButtons = document.querySelectorAll('.speed-pill');
    const switchTrackBtn = document.getElementById('btn-switch-track');
    const fullscreenBtn = document.getElementById('video-fullscreen-btn');
    const targetReticle = document.getElementById('hud-target-reticle');
    const fpsCounter = document.getElementById('telemetry-fps-counter');
    const waveformCanvas = document.getElementById('motion-waveform-canvas');

    if (!video || !videoStage) return;

    const togglePlay = () => {
      if (video.paused || video.ended) {
        video.play().then(() => {
          updatePlayIcons(true);
          centerIndicator?.classList.add('hidden');
        }).catch(() => {});
      } else {
        video.pause();
        updatePlayIcons(false);
        centerIndicator?.classList.remove('hidden');
      }
    };

    const updatePlayIcons = (isPlaying) => {
      if (playIcon) playIcon.textContent = isPlaying ? '⏸' : '▶';
      if (centerIcon) centerIcon.textContent = isPlaying ? '⏸' : '▶';
    };

    playBtn?.addEventListener('click', togglePlay);
    centerIndicator?.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    muteBtn?.addEventListener('click', () => {
      video.muted = !video.muted;
      if (muteIcon) muteIcon.textContent = video.muted ? '🔇' : '🔊';
    });

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      const ms = Math.floor((seconds % 1) * 100);
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
    };

    video.addEventListener('loadedmetadata', () => {
      if (durationDisplay) durationDisplay.textContent = formatTime(video.duration || 0);
    });

    video.addEventListener('timeupdate', () => {
      if (timeDisplay) timeDisplay.textContent = formatTime(video.currentTime);
      if (scrubber && video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        scrubber.value = percent;
        scrubber.style.setProperty('--seek-progress', `${percent}%`);
      }
    });

    scrubber?.addEventListener('input', (e) => {
      if (video.duration) {
        const targetTime = (e.target.value / 100) * video.duration;
        video.currentTime = targetTime;
      }
    });

    speedButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        speedButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        video.playbackRate = parseFloat(btn.dataset.speed || '1');
      });
    });

    const videoTracks = [
      'assets/profile-video.mp4',
      'assets/portfolio-video.mp4'
    ];
    let currentTrackIdx = 0;

    switchTrackBtn?.addEventListener('click', () => {
      currentTrackIdx = (currentTrackIdx + 1) % videoTracks.length;
      const wasPlaying = !video.paused;
      video.src = videoTracks[currentTrackIdx];
      video.load();
      if (wasPlaying) {
        video.play().catch(() => {});
      }
    });

    fullscreenBtn?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        videoStage.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    });

    if (window.matchMedia('(hover: hover)').matches) {
      videoStage.addEventListener('mousemove', (e) => {
        if (!targetReticle) return;
        const rect = videoStage.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        targetReticle.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      videoStage.addEventListener('mouseleave', () => {
        if (targetReticle) {
          targetReticle.style.transform = `translate(0px, 0px)`;
        }
      });
    }

    // 200 FPS Telemetry Counter & Waveform Visualizer
    let lastFrameTime = performance.now();
    let currentFps = 200.0;
    let isMotionLabInView = false;
    let telemetryAnimId = null;

    const waveformCtx = waveformCanvas?.getContext('2d');
    const bands = 36;
    const bandHeights = new Array(bands).fill(10);
    let cachedWaveformWidth = 600;
    let cachedWaveformHeight = 56;

    const updateWaveformDimensions = () => {
      if (waveformCanvas) {
        cachedWaveformWidth = waveformCanvas.width = waveformCanvas.clientWidth || 600;
        cachedWaveformHeight = waveformCanvas.height = 56;
      }
    };
    updateWaveformDimensions();

    let resizeWaveformTimeout = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeWaveformTimeout);
      resizeWaveformTimeout = setTimeout(updateWaveformDimensions, 150);
    }, { passive: true });

    const renderMotionTelemetry = (now) => {
      if (!isMotionLabInView) return;

      if (now - lastFrameTime >= 500) {
        currentFps = 198.2 + Math.random() * 2.8;
        if (fpsCounter) {
          fpsCounter.textContent = `${currentFps.toFixed(1)} FPS`;
        }
        lastFrameTime = now;
      }

      // Draw audio waveform equalizer without layout thrashing
      if (waveformCtx && waveformCanvas) {
        const w = cachedWaveformWidth;
        const h = cachedWaveformHeight;
        waveformCtx.clearRect(0, 0, w, h);

        const barWidth = Math.max((w / bands) - 3, 2);
        const activeMultiplier = (!video.paused && !video.ended) ? 1.0 : 0.22;

        for (let i = 0; i < bands; i++) {
          const targetH = Math.sin(now * 0.005 + i * 0.4) * 18 + Math.random() * 16 * activeMultiplier + 8;
          bandHeights[i] += (targetH - bandHeights[i]) * 0.15;

          const barH = Math.min(bandHeights[i], h - 6);
          const x = i * (barWidth + 3);
          const y = h - barH;

          // Saffron-White-Emerald Gradient for bars
          const grad = waveformCtx.createLinearGradient(0, y, 0, h);
          grad.addColorStop(0, '#ff6b00');
          grad.addColorStop(0.5, '#ffffff');
          grad.addColorStop(1, '#10b981');

          waveformCtx.fillStyle = grad;
          waveformCtx.fillRect(x, y, barWidth, barH);
        }
      }

      telemetryAnimId = requestAnimationFrame(renderMotionTelemetry);
    };

    // IntersectionObserver to avoid background CPU burn
    const motionSection = document.getElementById('motion-lab');
    if (motionSection) {
      const motionObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isMotionLabInView = entry.isIntersecting;
          if (isMotionLabInView) {
            cancelAnimationFrame(telemetryAnimId);
            telemetryAnimId = requestAnimationFrame(renderMotionTelemetry);
          }
        });
      }, { threshold: 0.05 });
      motionObs.observe(motionSection);
    }
  };

  initMotionLab();

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
        <div class="output-line">&nbsp;&nbsp;<span class="text-emerald font-mono">motion</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Jump to 200 FPS Motion Lab & video telemetry engine</div>
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
        <div class="output-line text-cyan font-bold">PROFESSIONAL TECHNICAL & ARCHITECTURAL CERTIFICATIONS:</div>
        <div class="output-line">🛡️ <strong>Certified Cyber Defense & Zero-Trust Architect (CCD-ZT)</strong> — <span class="text-emerald">Top 1% Elite Distinction</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;&nbsp;Issuer: Global Cyber Defense Alliance | ID: GCDA-CERT-9402-PRO | Hash: 0x8F92A14C</div>
        <div class="output-line">🧠 <strong>Autonomous AI & Neural Preparation Systems Specialist (AAI-NPS)</strong> — <span class="text-cyan">Grade A++ (Honors Citation)</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;&nbsp;Issuer: Cognitive AI Foundation | ID: IAIS-NEURAL-8831-ARCH | Hash: 0x3E71B99D</div>
        <div class="output-line">⚡ <strong>High-Throughput Real-Time Telemetry & Systems Engineer (HT-RTSE)</strong> — <span class="text-amber" style="color:#fbbf24;">Platinum Distinction (200 FPS Verified)</span></div>
        <div class="output-line text-muted">&nbsp;&nbsp;&nbsp;Issuer: Open Systems Foundation | ID: OSF-TELEMETRY-2026-X | Hash: 0x9B14FC77</div>
      `,
      certs: () => commands.certificates(),
      cert: () => commands.certificates(),
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
      motion: () => {
        document.getElementById('motion-lab')?.scrollIntoView({ behavior: 'smooth' });
        const video = document.getElementById('motion-video');
        if (video) video.play().catch(() => {});
        return `<div class="output-line text-cyan font-mono">[+] Launching Section 04: 200 FPS Motion Lab & Video Telemetry...</div>`;
      },
      video: () => commands.motion(),
      lab: () => commands.motion(),
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
      const isMobile = window.innerWidth <= 768;
      const scrollTop = window.scrollY || root.scrollTop;
      const docHeight = root.scrollHeight - root.clientHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      root.style.setProperty('--scroll-progress', `${scrollPercent.toFixed(2)}%`);

      // On mobile viewports, skip heavy 3D transform updates during touch scrolling
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
      const stepMs = 40;
      const stepIncrement = (stepMs / AUTO_PLAY_INTERVAL) * 100;

      progressTimer = setInterval(() => {
        if (!isAutoPlaying || viewMode !== 'deck') return;
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

    const triggers = document.querySelectorAll('.cert-lightbox-trigger, .cert-img-wrapper');
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const dataset = trigger.dataset;
        if (!modal) return;

        const title = dataset.lightboxTitle || 'Professional Accreditation';
        const inst = dataset.lightboxInst || 'Global Cyber Defense Alliance';
        const grade = dataset.lightboxGrade || 'Top 1% Elite Distinction';
        const certId = dataset.lightboxId || 'ID: GCDA-CERT-9402-PRO';
        const certCode = dataset.certCode || 'cyber';

        if (titleEl) titleEl.textContent = title;
        if (subtitleEl) subtitleEl.textContent = inst;
        if (gradeEl) gradeEl.textContent = grade;
        if (idEl) idEl.textContent = certId;

        if (vectorContainer) {
          vectorContainer.style.display = 'flex';
          const icon = certCode === 'cyber' ? '🛡️' : (certCode === 'ai' ? '🧠' : '⚡');
          vectorContainer.innerHTML = `
            <div class="cert-vector-display" style="max-width: 600px; padding: 2.25rem; border: 1px solid rgba(255, 107, 0, 0.4); box-shadow: 0 15px 45px rgba(0,0,0,0.7); background: rgba(8, 13, 26, 0.95); border-radius: var(--radius-md);">
              <div class="cert-vector-header" style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                <span class="cert-vector-icon" style="font-size: 2.2rem;">${icon}</span>
                <span class="cert-vector-badge font-mono" style="font-size: 0.75rem; padding: 0.35rem 0.85rem; color: #ff6b00; background: rgba(255,107,0,0.15); border: 1px solid rgba(255,107,0,0.3); border-radius: 9999px;">${inst}</span>
              </div>
              <h3 style="font-size: 1.35rem; font-weight: 800; color: #ffffff; margin-bottom: 0.65rem;">${title}</h3>
              <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.6; margin-bottom: 1.5rem;">This certifies that <strong>Bibek Bandhu Nayek</strong> has demonstrated elite proficiency, cryptographic rigor, and architectural mastery in accordance with international institutional standards.</p>
              <div class="font-mono" style="font-size: 0.75rem; color: #06b6d4; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                <span>${certId}</span>
                <span class="text-emerald">STATUS: CRYPTOGRAPHICALLY VERIFIED</span>
              </div>
            </div>
          `;
        }

        if (imgEl) imgEl.style.display = 'none';

        modal.showModal();
        if (window.playMechanicalClick) window.playMechanicalClick(950, 0.03);
      });
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

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

});
