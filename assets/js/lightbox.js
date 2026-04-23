/**
 * lightbox.js — illustration grid builder + fullscreen lightbox viewer
 */
(function () {
  'use strict';

  const grid    = document.getElementById('illustrationGrid');
  const lightbox = document.getElementById('lightbox');
  const backdrop = document.getElementById('lightboxBackdrop');
  const imgEl    = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn  = document.getElementById('lightboxPrev');
  const nextBtn  = document.getElementById('lightboxNext');

  if (!grid) return;

  const items = siteData.illustrations || [];
  let currentIdx = 0;
  let previousFocus = null;

  /* ── Build grid ── */
  if (items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'gallery-empty';
    empty.textContent = 'Illustrations coming soon.';
    grid.appendChild(empty);
  } else {
    items.forEach((item, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'gallery-item';
      wrapper.setAttribute('role', 'button');
      wrapper.setAttribute('tabindex', '0');
      wrapper.setAttribute('aria-label', 'View ' + (item.alt || 'illustration'));

      const img = document.createElement('img');
      img.src     = item.src;
      img.alt     = item.alt || '';
      img.loading = 'lazy';
      wrapper.appendChild(img);

      wrapper.addEventListener('click', () => openLightbox(i));
      wrapper.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
      });

      grid.appendChild(wrapper);
    });
  }

  /* ── Lightbox logic ── */
  function openLightbox(index) {
    if (!lightbox) return;
    previousFocus = document.activeElement;
    currentIdx = index;
    showImage(currentIdx);
    lightbox.hidden = false;
    lightbox.classList.remove('closing');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('closing');
    setTimeout(() => {
      lightbox.hidden = true;
      lightbox.classList.remove('closing');
      document.body.style.overflow = '';
      previousFocus && previousFocus.focus();
    }, 260);
  }

  function showImage(index) {
    const item = items[index];
    if (!item || !imgEl) return;
    imgEl.src = item.src;
    imgEl.alt = item.alt || '';
    /* Re-trigger animation */
    const frame = document.querySelector('.lightbox-frame');
    if (frame) { frame.style.animation = 'none'; frame.offsetHeight; frame.style.animation = ''; }
  }

  function prev() { currentIdx = (currentIdx - 1 + items.length) % items.length; showImage(currentIdx); }
  function next() { currentIdx = (currentIdx + 1) % items.length; showImage(currentIdx); }

  /* Controls */
  closeBtn  && closeBtn.addEventListener('click', closeLightbox);
  prevBtn   && prevBtn.addEventListener('click', prev);
  nextBtn   && nextBtn.addEventListener('click', next);
  backdrop  && backdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', e => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  /* Touch swipe inside lightbox */
  let touchX = 0;
  lightbox && lightbox.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox && lightbox.addEventListener('touchend', e => {
    const delta = touchX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) { delta > 0 ? next() : prev(); }
  }, { passive: true });
})();
