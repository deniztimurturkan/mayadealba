(function () {
  'use strict';

  const bioEl = document.getElementById('bioShort');
  if (bioEl && siteData.bio) bioEl.textContent = siteData.bio.short;

  const emailEl = document.getElementById('footerEmail');
  const igEl    = document.getElementById('footerInstagram');
  if (emailEl && siteData.email) emailEl.href = 'mailto:' + siteData.email;
  if (igEl && siteData.instagram) igEl.href = siteData.instagram;

  const track    = document.getElementById('carouselTrack');
  const viewport = document.getElementById('carouselViewport');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn  = document.querySelector('.carousel-btn--prev');
  const nextBtn  = document.querySelector('.carousel-btn--next');

  if (!track || !viewport) return;

  const slides = siteData.heroImages || [];
  const total  = slides.length;
  if (total === 0) return;

  // 2 clones on each side means the peek on either edge is always filled
  const CLONES = 2;
  const GAP    = 8;   // px gap between slides
  const MS     = 600; // animation duration

  let current   = 0;
  let busy      = false;
  let autoTimer = null;

  function makeSlide(data) {
    const div = document.createElement('div');
    div.className = 'carousel-slide';
    if (data.src) {
      const img = document.createElement('img');
      img.src     = data.src;
      img.alt     = data.alt || '';
      img.loading = 'lazy';
      div.appendChild(img);
    } else {
      div.classList.add('carousel-slide--placeholder');
      div.textContent = 'Image coming soon';
    }
    return div;
  }

  // Track layout: [clone(N-2), clone(N-1), real(0)…real(N-1), clone(0), clone(1)]
  // Visual index of real(i) = CLONES + i
  for (let i = total - CLONES; i < total; i++) track.appendChild(makeSlide(slides[(i + total) % total]));
  slides.forEach(s => track.appendChild(makeSlide(s)));
  for (let i = 0; i < CLONES; i++) track.appendChild(makeSlide(slides[i % total]));

  // Dots
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    btn.addEventListener('click', () => { if (!busy) goTo(i); });
    dotsWrap.appendChild(btn);
  });

  function updateDots() {
    document.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  // Square slides: width = carousel height so images fill without distortion
  function applyAndTranslate(vi, animate) {
    const slideW   = viewport.offsetHeight;
    const step     = slideW + GAP;
    const centerOff = (viewport.offsetWidth - slideW) / 2;

    track.querySelectorAll('.carousel-slide').forEach(s => {
      s.style.width       = slideW + 'px';
      s.style.marginRight = GAP + 'px';
    });

    if (!animate) {
      track.style.transition = 'none';
      void track.offsetWidth; // force reflow so snap is instant
    } else {
      track.style.transition = 'transform ' + MS + 'ms cubic-bezier(0.25,0.46,0.45,0.94)';
    }
    track.style.transform = 'translateX(' + (-(vi * step) + centerOff) + 'px)';
  }

  function goTo(index) {
    current = ((index % total) + total) % total;
    applyAndTranslate(CLONES + current, true);
    updateDots();
    resetAuto();
  }

  function move(dir) {
    if (busy) return;
    busy = true;

    const atEdge = dir === 1 ? current === total - 1 : current === 0;

    if (atEdge) {
      // Animate into the clone on the far side, then silently snap to the real counterpart
      const animVI = dir === 1 ? CLONES + total     : CLONES - 1;
      const snapVI = dir === 1 ? CLONES             : CLONES + total - 1;
      current = dir === 1 ? 0 : total - 1;
      applyAndTranslate(animVI, true);
      updateDots();
      setTimeout(() => {
        applyAndTranslate(snapVI, false);
        busy = false;
      }, MS);
    } else {
      current += dir;
      applyAndTranslate(CLONES + current, true);
      updateDots();
      setTimeout(() => { busy = false; }, MS);
    }
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => move(1), 4000);
  }

  // Init: start at real(0), no animation
  applyAndTranslate(CLONES, false);
  updateDots();

  prevBtn && prevBtn.addEventListener('click', () => move(-1));
  nextBtn && nextBtn.addEventListener('click', () => move(1));

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  move(-1);
    if (e.key === 'ArrowRight') move(1);
  });

  viewport.addEventListener('mouseenter', () => clearInterval(autoTimer));
  viewport.addEventListener('mouseleave', resetAuto);

  let touchX = 0;
  viewport.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const dx = touchX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) move(dx > 0 ? 1 : -1);
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => applyAndTranslate(CLONES + current, false), 150);
  });

  resetAuto();
})();
