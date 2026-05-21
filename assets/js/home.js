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

  const CLONES = 2;
  const GAP    = 2;
  const MS     = 600;

  let current   = 0;
  let busy      = false;
  let autoTimer = null;

  function makeSlide(data) {
    const div = document.createElement('div');
    div.className = 'carousel-slide';
    if (data.src) {
      const img = document.createElement('img');
      img.src = data.src;
      img.alt = data.alt || '';
      div.appendChild(img);
    } else {
      div.classList.add('carousel-slide--placeholder');
      div.textContent = 'Image coming soon';
    }
    return div;
  }

  // Track layout: [clone(N-2), clone(N-1), real(0)…real(N-1), clone(0), clone(1)]
  const trackData = [];
  for (let i = total - CLONES; i < total; i++) trackData.push(slides[(i + total) % total]);
  slides.forEach(s => trackData.push(s));
  for (let i = 0; i < CLONES; i++) trackData.push(slides[i % total]);

  const trackEls = trackData.map(data => {
    const el = makeSlide(data);
    track.appendChild(el);
    return el;
  });

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

  // Each slide's width derived from the image's natural aspect ratio
  function getSlideWidths() {
    const h = viewport.offsetHeight;
    return trackEls.map(el => {
      const img = el.querySelector('img');
      if (img && img.naturalWidth && img.naturalHeight) {
        return Math.round(h * img.naturalWidth / img.naturalHeight);
      }
      return h; // square fallback for placeholders / not-yet-loaded
    });
  }

  // Cumulative left-edge position of each slide in the track
  function getOffsets(widths) {
    const offsets = [];
    let pos = 0;
    widths.forEach(w => { offsets.push(pos); pos += w + GAP; });
    return offsets;
  }

  function applyAndTranslate(vi, animate) {
    const widths  = getSlideWidths();
    const offsets = getOffsets(widths);

    trackEls.forEach((el, i) => {
      el.style.width       = widths[i] + 'px';
      el.style.marginRight = GAP + 'px';
    });

    const centerOff = (viewport.offsetWidth - widths[vi]) / 2;

    if (!animate) {
      track.style.transition = 'none';
      void track.offsetWidth;
    } else {
      track.style.transition = 'transform ' + MS + 'ms cubic-bezier(0.25,0.46,0.45,0.94)';
    }
    track.style.transform = 'translateX(' + (-offsets[vi] + centerOff) + 'px)';
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
      const animVI = dir === 1 ? CLONES + total : CLONES - 1;
      const snapVI = dir === 1 ? CLONES         : CLONES + total - 1;
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

  // Re-apply once all images have loaded so natural dimensions are available
  const allImgs = Array.from(track.querySelectorAll('img'));
  Promise.all(
    allImgs.map(img =>
      img.complete
        ? Promise.resolve()
        : new Promise(res => { img.onload = res; img.onerror = res; })
    )
  ).then(() => applyAndTranslate(CLONES + current, false));

  // Immediate init (handles cached images)
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
