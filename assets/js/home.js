/**
 * home.js — hero carousel + bio text injection
 */
(function () {
  'use strict';

  /* ── Bio text ── */
  const bioEl = document.getElementById('bioShort');
  if (bioEl && siteData.bio) {
    bioEl.textContent = siteData.bio.short;
  }

  /* ── Footer links ── */
  const emailEl = document.getElementById('footerEmail');
  const igEl    = document.getElementById('footerInstagram');
  if (emailEl && siteData.email) emailEl.href = 'mailto:' + siteData.email;
  if (igEl && siteData.instagram)  igEl.href  = siteData.instagram;

  /* ── Carousel ── */
  const track    = document.getElementById('carouselTrack');
  const viewport = document.getElementById('carouselViewport');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn  = document.querySelector('.carousel-btn--prev');
  const nextBtn  = document.querySelector('.carousel-btn--next');

  if (!track || !viewport) return;

  const slides = siteData.heroImages || [];
  const total  = slides.length;
  if (total === 0) return;

  let currentIndex = 0;
  let autoTimer    = null;

  /* Build slide elements */
  slides.forEach((slide, i) => {
    const div = document.createElement('div');
    div.className = 'carousel-slide';
    div.setAttribute('role', 'group');
    div.setAttribute('aria-label', 'Slide ' + (i + 1) + ' of ' + total);

    if (slide.src) {
      const img = document.createElement('img');
      img.src  = slide.src;
      img.alt  = slide.alt || '';
      img.loading = i === 0 ? 'eager' : 'lazy';
      div.appendChild(img);
    } else {
      div.classList.add('carousel-slide--placeholder');
      div.textContent = 'Image coming soon';
    }

    track.appendChild(div);
  });

  /* Build dots */
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    btn.addEventListener('click', () => { goTo(i); startAuto(); });
    dotsWrap.appendChild(btn);
  });

  function getMetrics() {
    const vw         = viewport.offsetWidth;
    const isMobile   = window.innerWidth < 768;
    const slideWidth = isMobile ? vw : vw * 0.70;
    const peek       = isMobile ? 0 : (vw - slideWidth) / 2;
    return { slideWidth, peek };
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, total - 1));
    const { slideWidth, peek } = getMetrics();

    /* Size every slide */
    document.querySelectorAll('.carousel-slide').forEach(s => {
      s.style.width = slideWidth + 'px';
    });

    track.style.transform = 'translateX(' + (-(currentIndex * slideWidth) + peek) + 'px)';

    /* Update dots */
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function next() { goTo(currentIndex === total - 1 ? 0 : currentIndex + 1); }
  function prev() { goTo(currentIndex === 0 ? total - 1 : currentIndex - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 4000);
  }

  function stopAuto() { clearInterval(autoTimer); }

  /* Initial render without animation, then enable transition */
  goTo(0);
  requestAnimationFrame(() => track.classList.add('animated'));

  /* Controls */
  prevBtn && prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { next(); startAuto(); });

  /* Keyboard */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { prev(); startAuto(); }
    if (e.key === 'ArrowRight') { next(); startAuto(); }
  });

  /* Pause on hover */
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);

  /* Touch / swipe */
  let touchX = 0;
  viewport.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const delta = touchX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) { delta > 0 ? next() : prev(); startAuto(); }
  }, { passive: true });

  /* Recalculate on resize */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goTo(currentIndex), 120);
  });

  startAuto();
})();
