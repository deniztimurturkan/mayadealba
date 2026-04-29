/**
 * motion.js — builds the motion project grid
 */
(function () {
  'use strict';

  const grid = document.getElementById('motionGrid');
  if (!grid) return;

  const projects = siteData.motionProjects || [];

  if (projects.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'motion-empty';
    empty.textContent = 'Motion projects coming soon.';
    grid.appendChild(empty);
    return;
  }

  const PLAY_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;

  projects.forEach(project => {
    const a = document.createElement('a');
    a.className = 'motion-card';
    a.href      = 'motion-detail.html?id=' + encodeURIComponent(project.id);
    a.setAttribute('aria-label', project.title);

    /* Thumbnail wrapper */
    const media = document.createElement('div');
    media.className = 'motion-card__media';

    if (project.thumbnail) {
      const img = document.createElement('img');
      img.src       = project.thumbnail;
      img.alt       = project.title;
      img.loading   = 'lazy';
      img.className = 'motion-card__thumb';
      media.appendChild(img);
    } else {
      media.classList.add('motion-card__media--placeholder');
      media.textContent = project.title;
    }

    /* Play overlay */
    const overlay = document.createElement('div');
    overlay.className = 'motion-card__overlay';
    const playBtn = document.createElement('span');
    playBtn.className   = 'motion-card__play';
    playBtn.innerHTML   = PLAY_ICON;
    overlay.appendChild(playBtn);
    media.appendChild(overlay);

    /* Info */
    const info = document.createElement('div');
    info.className = 'motion-card__info';

    const title = document.createElement('h2');
    title.className   = 'motion-card__title';
    title.textContent = project.title;
    info.appendChild(title);

    if (project.tagline) {
      const tagline = document.createElement('p');
      tagline.className   = 'motion-card__tagline';
      tagline.textContent = project.tagline;
      info.appendChild(tagline);
    }

    a.appendChild(media);
    a.appendChild(info);
    grid.appendChild(a);
  });
})();
