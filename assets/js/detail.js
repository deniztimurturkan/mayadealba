/**
 * detail.js — loads surface project data from URL param, builds page, scroll reveal
 */
(function () {
  'use strict';

  const params    = new URLSearchParams(window.location.search);
  const projectId = params.get('id');
  const project   = (siteData.surfaceProjects || []).find(p => p.id === projectId);

  const titleEl       = document.getElementById('detailTitle');
  const descEl        = document.getElementById('detailDescription');
  const galleryEl     = document.getElementById('detailGallery');
  const processEl     = document.getElementById('detailProcess');
  const processDescEl = document.getElementById('processDescription');
  const processImgEl  = document.getElementById('processImages');
  const mockupsEl     = document.getElementById('detailMockups');
  const mockupImgEl   = document.getElementById('mockupImages');

  if (!project) {
    if (titleEl) titleEl.textContent = 'Project not found.';
    if (descEl)  descEl.textContent  = 'Return to Surface Design to browse all projects.';
    return;
  }

  /* ── Page metadata ── */
  document.title = project.title + ' — Maya de Alba';

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = project.description || '';

  /* ── Populate text ── */
  if (titleEl) titleEl.textContent = project.title;
  if (descEl && project.description) descEl.textContent = project.description;

  /* ── Build image gallery ── */
  function makeRevealImg(src, alt) {
    const img = document.createElement('img');
    img.src     = src;
    img.alt     = alt || '';
    img.loading = 'lazy';
    return img;
  }

  if (galleryEl && project.images && project.images.length) {
    project.images.forEach(src => {
      galleryEl.appendChild(makeRevealImg(src, project.title));
    });
  }

  /* ── Process section ── */
  if (processEl && (project.processDescription || (project.processImages && project.processImages.length))) {
    processEl.hidden = false;
    if (processDescEl && project.processDescription) {
      processDescEl.textContent = project.processDescription;
    }
    if (processImgEl && project.processImages) {
      project.processImages.forEach(src => {
        processImgEl.appendChild(makeRevealImg(src, 'Process — ' + project.title));
      });
    }
  }

  /* ── Mockup section ── */
  if (mockupsEl && mockupImgEl && project.mockupImages && project.mockupImages.length) {
    mockupsEl.hidden = false;
    project.mockupImages.forEach(src => {
      mockupImgEl.appendChild(makeRevealImg(src, 'Mockup — ' + project.title));
    });
  }

  /* ── Scroll reveal via IntersectionObserver ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.detail-gallery img, .process-images img, .mockup-images img'
  ).forEach(img => observer.observe(img));
})();
