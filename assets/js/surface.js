/**
 * surface.js — builds the flip-card grid and handles click navigation to detail page
 */
(function () {
  'use strict';

  const grid = document.getElementById('surfaceGrid');
  if (!grid) return;

  const projects = siteData.surfaceProjects || [];
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (projects.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'surface-empty';
    empty.textContent = 'Surface design projects coming soon.';
    grid.appendChild(empty);
    return;
  }

  projects.forEach(project => {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-wrapper';
    wrapper.setAttribute('role', 'article');
    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('aria-label', project.title);

    const card = document.createElement('div');
    card.className = 'card';

    /* Front */
    const front = document.createElement('div');
    front.className = 'card-front';
    if (project.thumbnail) {
      const img = document.createElement('img');
      img.src     = project.thumbnail;
      img.alt     = project.title;
      img.loading = 'lazy';
      front.appendChild(img);
    } else {
      front.classList.add('card-front--placeholder');
      front.textContent = project.title;
    }

    /* Back */
    const back = document.createElement('div');
    back.className = 'card-back';

    const title = document.createElement('h2');
    title.className = 'card-back-title';
    title.textContent = project.title;
    back.appendChild(title);

    if (project.tagline) {
      const tagline = document.createElement('p');
      tagline.className = 'card-back-tagline';
      tagline.textContent = project.tagline;
      back.appendChild(tagline);
    }

    const cta = document.createElement('span');
    cta.className = 'card-back-cta';
    cta.textContent = 'View Project';
    back.appendChild(cta);

    card.appendChild(front);
    card.appendChild(back);
    wrapper.appendChild(card);
    grid.appendChild(wrapper);

    /* Navigation */
    const navigate = () => {
      window.location.href = 'surface-detail.html?id=' + encodeURIComponent(project.id);
    };

    if (isTouchDevice) {
      /* On touch: first tap flips, second tap navigates */
      wrapper.addEventListener('click', () => {
        if (wrapper.classList.contains('tapped')) {
          navigate();
        } else {
          wrapper.classList.add('tapped');
        }
      });

      /* Tapping elsewhere closes any open card */
      document.addEventListener('click', e => {
        if (!wrapper.contains(e.target)) wrapper.classList.remove('tapped');
      });
    } else {
      /* On pointer devices: click navigates directly (hover already flips) */
      wrapper.addEventListener('click', navigate);
      wrapper.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(); }
      });
    }
  });
})();
