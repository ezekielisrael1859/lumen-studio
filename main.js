/* ============================================
   LUMEN STUDIO — MAIN JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== FOOTER YEAR ===== */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ===== NAV SCROLL STATE ===== */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ===== HERO CROSS-FADE ===== */
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length > 1 && !reducedMotion) {
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 5000);
  }

  /* ===== SCROLL REVEAL ===== */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ===== PORTFOLIO FILTER ===== */
  const filters = document.querySelectorAll('.filter');
  const gridItems = document.querySelectorAll('.grid__item');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('is-active'));
      btn.classList.add('is-active');
      const category = btn.dataset.filter;

      gridItems.forEach(item => {
        const match = category === 'all' || item.dataset.category === category;
        if (match) {
          item.classList.remove('is-hidden');
          item.style.opacity = '0';
          requestAnimationFrame(() => { item.style.opacity = '1'; });
        } else {
          item.classList.add('is-hidden');
        }
      });
    });
  });

  /* ===== LIGHTBOX ===== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let visibleItems = [];
  let currentIndex = 0;

  const getVisibleItems = () =>
    Array.from(gridItems).filter(item => !item.classList.contains('is-hidden'));

  const openLightbox = (index) => {
    visibleItems = getVisibleItems();
    currentIndex = index;
    const img = visibleItems[currentIndex].querySelector('img');
    lightboxImg.src = img.dataset.full;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  const showIndex = (index) => {
    currentIndex = (index + visibleItems.length) % visibleItems.length;
    const img = visibleItems[currentIndex].querySelector('img');
    lightboxImg.src = img.dataset.full;
    lightboxImg.alt = img.alt;
  };

  gridItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const visible = getVisibleItems();
      const visIndex = visible.indexOf(item);
      openLightbox(visIndex);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showIndex(currentIndex - 1));
  lightboxNext.addEventListener('click', () => showIndex(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showIndex(currentIndex - 1);
    if (e.key === 'ArrowRight') showIndex(currentIndex + 1);
  });

  /* Swipe navigation */
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showIndex(currentIndex - 1);
      else showIndex(currentIndex + 1);
    }
  }, { passive: true });

  /* ===== ENQUIRY FORM → WHATSAPP ===== */
  const enquiryForm = document.getElementById('enquiryForm');
  const WHATSAPP_NUMBER = '2340000000000';

  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('enqName').value.trim();
    const type = document.getElementById('enqType').value.trim();
    const message = document.getElementById('enqMessage').value.trim();

    let text = `Hi Lumen Studio, my name is ${name}.`;
    if (type) text += ` I'm interested in: ${type}.`;
    if (message) text += ` ${message}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });

});