/**
 * about.js — injects bio text and contact links from data.js
 */
(function () {
  'use strict';

  const bioEl = document.getElementById('aboutBio');
  if (bioEl && siteData.bio && siteData.bio.long) {
    siteData.bio.long.split('\n\n').forEach(para => {
      if (!para.trim()) return;
      const p = document.createElement('p');
      p.textContent = para.trim();
      bioEl.appendChild(p);
    });
  }

  const emailLinks = [
    document.getElementById('contactEmail'),
    document.getElementById('footerEmail'),
  ];
  const igLinks = [
    document.getElementById('contactInstagram'),
    document.getElementById('footerInstagram'),
  ];

  if (siteData.email) {
    emailLinks.forEach(el => {
      if (!el) return;
      el.href = 'mailto:' + siteData.email;
      const textSpan = el.querySelector('span:not(.contact-link-icon)');
      if (textSpan) textSpan.textContent = siteData.email;
      else if (el.id === 'footerEmail') el.textContent = 'Email';
    });
  }

  if (siteData.instagram) {
    igLinks.forEach(el => {
      if (el) el.href = siteData.instagram;
    });
  }
})();
