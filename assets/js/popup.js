/**
 * popup.js — reusable popup card with X-button close.
 * TEMPORARY: scheduled for removal in a couple days.
 * Usage: openPopup({ title, body, imgSrc, imgAlt, actions })
 *   actions: [{ text: 'Label', href: 'url' }]  (optional)
 */
(function () {
  'use strict';

  /* ── Build DOM ── */
  const backdrop = document.createElement('div');
  backdrop.className = 'popup-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-labelledby', 'popupTitle');
  backdrop.hidden = true;

  backdrop.innerHTML = `
    <div class="popup-card">
      <button class="popup-close" aria-label="Close popup">&#x2715;</button>
      <img class="popup-card__img" id="popupImg" src="" alt="" hidden>
      <h2 class="popup-card__title" id="popupTitle"></h2>
      <div class="popup-card__body" id="popupBody"></div>
      <div class="popup-card__actions" id="popupActions"></div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const closeBtn    = backdrop.querySelector('.popup-close');
  const imgEl       = backdrop.querySelector('#popupImg');
  const titleEl     = backdrop.querySelector('#popupTitle');
  const bodyEl      = backdrop.querySelector('#popupBody');
  const actionsEl   = backdrop.querySelector('#popupActions');
  let previousFocus = null;

  /* ── Open ── */
  function openPopup({ title = '', body = '', imgSrc = '', imgAlt = '', actions = [] } = {}) {
    titleEl.textContent = title;
    bodyEl.innerHTML    = body;

    if (imgSrc) {
      imgEl.src    = imgSrc;
      imgEl.alt    = imgAlt;
      imgEl.hidden = false;
    } else {
      imgEl.hidden = true;
    }

    actionsEl.innerHTML = '';
    actions.forEach(({ text, href }) => {
      const a = document.createElement('a');
      a.href      = href;
      a.className = 'btn';
      a.textContent = text;
      actionsEl.appendChild(a);
    });

    previousFocus = document.activeElement;
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  /* ── Close ── */
  function closePopup() {
    backdrop.classList.remove('is-open');
    setTimeout(() => {
      backdrop.hidden = true;
      document.body.style.overflow = '';
      previousFocus && previousFocus.focus();
    }, 260);
  }

  /* ── Events ── */
  closeBtn.addEventListener('click', closePopup);

  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closePopup();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !backdrop.hidden) closePopup();
  });

  window.openPopup  = openPopup;
  window.closePopup = closePopup;
})();
