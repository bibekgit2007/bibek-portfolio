/**
 * THROTTLE & DEBOUNCE UTILITIES FOR SCROLL PERFORMANCE
 * Replace scroll handlers with throttled versions to prevent jank
 * Max 60fps (16.67ms) or 30fps (33.33ms) throttle intervals
 */

// =====================================================================
// UTILITY: Throttle Function (Ensures max execution frequency)
// =====================================================================
function throttle(callback, limit = 16) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      callback.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// =====================================================================
// UTILITY: Request Animation Frame Throttle (Most Performant)
// =====================================================================
function throttleRAF(callback) {
  let ticking = false;
  return function(...args) {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

// =====================================================================
// OPTIMIZED: 05. IMMERSIVE 3D SCROLL PHYSICS (THROTTLED)
// =====================================================================
// BEFORE: Raw scroll listener causing jank
// window.addEventListener('scroll', onScroll, { passive: true });

// AFTER: Throttled to 60fps (requestAnimationFrame)
const initImmersiveScrollOptimized = () => {
  const root = document.documentElement;
  const heroSection = document.getElementById('hero');
  const spiralWrapper = document.getElementById('spiral-chart-wrapper');
  const spiralSpline = document.getElementById('spiral-trajectory-path');
  const immersiveCards = document.querySelectorAll('.immersive-scroll-card');

  let isTicking = false;
  let lastScrollY = 0;

  const onScroll = () => {
    const scrollTop = lastScrollY;
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

    // Dynamic Spiral Orbit
    if (spiralWrapper && spiralSpline) {
      const rect = spiralWrapper.getBoundingClientRect();
      const winHeight = window.innerHeight;

      if (rect.top <= winHeight && rect.bottom >= 0) {
        const totalDistance = rect.height + winHeight;
        const currentProgress = (winHeight - rect.top) / totalDistance;
        const clamped = Math.min(Math.max(currentProgress, 0), 1);
        const offsetVal = 1200 * (1 - clamped);
        spiralSpline.style.strokeDashoffset = `${offsetVal.toFixed(1)}`;
      }
    }

    // Immersive Card Tilt
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

  // RAF-throttled scroll listener
  const handleScroll = () => {
    lastScrollY = window.scrollY || document.documentElement.scrollTop;
    if (!isTicking) {
      window.requestAnimationFrame(onScroll);
      isTicking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  onScroll(); // Initial call
};

// =====================================================================
// OPTIMIZED: 01B. TRACING BEAM (THROTTLED TO 60fps)
// =====================================================================
const initTracingBeamOptimized = () => {
  const beamContainer = document.getElementById('tracing-beam-container');
  const laserDot = document.getElementById('tracing-laser-dot');
  const activeLine = document.getElementById('tracing-beam-active-line');
  if (!beamContainer || !laserDot) return;

  const updateBeam = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? Math.min(Math.max(scrollTop / scrollHeight, 0), 1) : 0;

    laserDot.style.top = `${(progress * 100).toFixed(2)}%`;

    if (activeLine) {
      const containerHeight = beamContainer.clientHeight || window.innerHeight;
      activeLine.setAttribute('y2', `${(progress * containerHeight).toFixed(1)}`);
    }
  };

  // Throttle to 60fps using RAF
  const throttledUpdate = throttleRAF(updateBeam);

  window.addEventListener('scroll', throttledUpdate, { passive: true });
  window.addEventListener('resize', throttledUpdate, { passive: true });
  updateBeam();
};

// =====================================================================
// OPTIMIZED: 10. SCROLL NAVIGATION & PROGRESS RING (THROTTLED)
// =====================================================================
const initNavigationScrollOptimized = () => {
  const navbar = document.getElementById('navbar');
  const progressCircle = document.querySelector('.progress-ring-circle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;
  }

  const handleScrollProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollFraction = docHeight > 0 ? scrollTop / docHeight : 0;

    // Navbar visibility
    if (scrollTop > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Progress circle
    if (progressCircle) {
      const offset = circumference - scrollFraction * circumference;
      progressCircle.style.strokeDashoffset = offset;
    }

    // Active section detection
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
  };

  // Throttle to 60fps
  const throttledScroll = throttleRAF(handleScrollProgress);
  window.addEventListener('scroll', throttledScroll, { passive: true });
  handleScrollProgress(); // Initial call
};

// =====================================================================
// OPTIMIZED: 04. CARD SPOTLIGHT TRACKING (THROTTLED MOUSEMOVE)
// =====================================================================
const initCardEffectsOptimized = () => {
  const spotlightCards = document.querySelectorAll('.spotlight-card');

  spotlightCards.forEach((card) => {
    // Throttle mousemove to 60fps to prevent excessive calculations
    const handleMousemove = throttle((e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }, 16); // 60fps

    card.addEventListener('mousemove', handleMousemove);
  });

  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    const inner = card.querySelector('.project-card-inner');
    if (!inner) return;

    const handleMousemove = throttle((e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    }, 16); // 60fps

    card.addEventListener('mousemove', handleMousemove);

    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
};

// =====================================================================
// OPTIMIZED: Certificate Motion Engine (Throttled)
// =====================================================================
const initCertificateMotionOptimized = () => {
  const certCards = document.querySelectorAll('.cert-interactive-card');

  certCards.forEach((card) => {
    const holoGlare = card.querySelector('.cert-holo-glare');

    const handleMousemove = throttle((e) => {
      const rect = card.getBoundingClientRect();
      const cardX = e.clientX - rect.left;
      const cardY = e.clientY - rect.top;

      const normX = (cardX / rect.width - 0.5) * 2;
      const normY = (cardY / rect.height - 0.5) * 2;

      const rotateX = -normY * 11;
      const rotateY = normX * 11;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`;

      if (holoGlare) {
        const posX = ((normX + 1) / 2) * 100;
        const posY = ((normY + 1) / 2) * 100;
        holoGlare.style.backgroundPosition = `${posX.toFixed(1)}% ${posY.toFixed(1)}%`;
      }
    }, 16); // 60fps

    card.addEventListener('mousemove', handleMousemove);

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
};

// =====================================================================
// INTEGRATION: Replace original scroll handlers
// =====================================================================
// After DOMContentLoaded, replace the original functions with throttled versions:
//
// Replace:
//   initImmersiveScroll() → initImmersiveScrollOptimized()
//   initTracingBeam() → initTracingBeamOptimized()
//   initNavigationAndScroll() → initNavigationScrollOptimized()
//   initCardEffects() → initCardEffectsOptimized()
//   initCertificateMotionEngine() → initCertificateMotionOptimized()
//
// In script.js, comment out the original calls and add:
//   initImmersiveScrollOptimized();
//   initTracingBeamOptimized();
//   initNavigationScrollOptimized();
//   initCardEffectsOptimized();
//   initCertificateMotionOptimized();
