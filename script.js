// =============================================
// CARISSIMO - Main JavaScript (Revised)
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- NAVBAR SCROLL ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ---- HAMBURGER DROPDOWN (mobile) ----
  const hamburger    = document.getElementById('hamburger');
  const navDropdown  = document.getElementById('navDropdown');
  const hamburgerWrap = document.getElementById('hamburgerWrap');

  if (hamburger && navDropdown) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navDropdown.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close dropdown on link click
    navDropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navDropdown.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (hamburgerWrap && !hamburgerWrap.contains(e.target)) {
        navDropdown.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- LEGACY: desktop nav-links hamburger (no longer used on mobile but keep for safety) ----
  const navLinks = document.getElementById('navLinks');
  if (navLinks && hamburger && !navDropdown) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- ABOUT SLIDER (mobile swipe) ----
  const sliderTrack = document.getElementById('aboutSliderTrack');
  const dots        = document.querySelectorAll('.about-dot');

  if (sliderTrack && dots.length) {
    let currentSlide = 0;
    const totalSlides = sliderTrack.children.length;

    function goToSlide(index) {
      currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
      sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    // Dot clicks
    dots.forEach(dot => {
      dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
    });

    // Touch swipe
    let touchStartX = 0;
    let touchEndX   = 0;
    const threshold = 40;

    sliderTrack.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    sliderTrack.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > threshold) {
        goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
      }
    }, { passive: true });

    // Auto-advance every 4s on mobile
    let autoSlide = setInterval(() => {
      if (window.innerWidth <= 768) goToSlide(currentSlide + 1);
    }, 4000);

    // Pause auto on touch
    sliderTrack.addEventListener('touchstart', () => {
      clearInterval(autoSlide);
    }, { passive: true });
  }

  // ---- SCROLL REVEAL ----
  const autoRevealSelectors = [
    '.about-content > *',
    '.product-card',
    '.platform-card',
    '.gallery-vol-header',
    '.gallery-item',
    '.contact-inner > *'
  ];

  autoRevealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.07}s`;
    });
  });

  const revealAll = document.querySelectorAll('.reveal');
  if (revealAll.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealAll.forEach(el => revealObs.observe(el));
  }

  // ---- ACTIVE NAV LINK ON SCROLL (main page) ----
  const sections     = document.querySelectorAll('section[id]');
  const navLinkItems = document.querySelectorAll('.nav-link[href^="#"]');

  if (sections.length && navLinkItems.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 130) current = section.getAttribute('id');
      });
      navLinkItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });
    });
  }

  // ---- SMOOTH PARALLAX ON HERO ----
  const heroBg = document.querySelector('.hero-bg-img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.25}px)`;
    }, { passive: true });
  }

  // ---- BACK BUTTON (history-aware) ----
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (document.referrer && document.referrer.includes(window.location.hostname)) {
        history.back();
      } else {
        window.location.href = 'index.html#products';
      }
    });
  }

  // ---- IMAGE LIGHTBOX (gallery pages) ----
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.style.cssText = `
      display:none; position:fixed; inset:0;
      background:rgba(0,0,0,0.96); z-index:9999;
      align-items:center; justify-content:center; cursor:zoom-out;
    `;

    const lbImg = document.createElement('img');
    lbImg.style.cssText = `
      max-width:92vw; max-height:88vh; object-fit:contain;
      border:1px solid rgba(255,255,255,0.08);
    `;

    const lbClose = document.createElement('button');
    lbClose.innerHTML = '&times;';
    lbClose.style.cssText = `
      position:absolute; top:20px; right:24px;
      background:none; border:none; color:#fff;
      font-size:2.2rem; cursor:pointer; line-height:1; opacity:0.7;
      transition:opacity 0.2s;
    `;
    lbClose.onmouseover = () => lbClose.style.opacity = '1';
    lbClose.onmouseout  = () => lbClose.style.opacity = '0.7';

    const makeNavBtn = (html) => {
      const btn = document.createElement('button');
      btn.innerHTML = html;
      btn.style.cssText = `
        background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15);
        color:#fff; padding:12px 18px; font-size:1.1rem; cursor:pointer;
        transition:background 0.2s; border-radius:3px;
      `;
      btn.onmouseover = () => btn.style.background = 'rgba(255,255,255,0.18)';
      btn.onmouseout  = () => btn.style.background = 'rgba(255,255,255,0.08)';
      return btn;
    };

    const lbNav  = document.createElement('div');
    lbNav.style.cssText = `
      position:absolute; bottom:20px; left:50%; transform:translateX(-50%);
      display:flex; gap:10px;
    `;
    const lbPrev = makeNavBtn('&#8592;');
    const lbNext = makeNavBtn('&#8594;');
    lbNav.appendChild(lbPrev);
    lbNav.appendChild(lbNext);

    lightbox.append(lbImg, lbClose, lbNav);
    document.body.appendChild(lightbox);

    const images = [...galleryItems].map(item => item.querySelector('img')?.src).filter(Boolean);
    let currentIndex = 0;

    galleryItems.forEach((item, i) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        currentIndex = i;
        lbImg.src = images[currentIndex];
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    };

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    lbPrev.addEventListener('click', e => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      lbImg.src = images[currentIndex];
    });
    lbNext.addEventListener('click', e => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % images.length;
      lbImg.src = images[currentIndex];
    });

    // Touch swipe in lightbox
    let lbTouchX = 0;
    lbImg.addEventListener('touchstart', e => { lbTouchX = e.changedTouches[0].clientX; }, { passive: true });
    lbImg.addEventListener('touchend', e => {
      const diff = lbTouchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        currentIndex = diff > 0
          ? (currentIndex + 1) % images.length
          : (currentIndex - 1 + images.length) % images.length;
        lbImg.src = images[currentIndex];
      }
    }, { passive: true });

    document.addEventListener('keydown', e => {
      if (lightbox.style.display === 'flex') {
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')   lbPrev.click();
        if (e.key === 'ArrowRight')  lbNext.click();
      }
    });
  }

});
