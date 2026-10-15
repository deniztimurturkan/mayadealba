(function () {
  'use strict';

  const emailEl = document.getElementById('footerEmail');
  const igEl    = document.getElementById('footerInstagram');
  if (emailEl && siteData.email) emailEl.href = 'mailto:' + siteData.email;
  if (igEl && siteData.instagram) igEl.href = siteData.instagram;
})();
