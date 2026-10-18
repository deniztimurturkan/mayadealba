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

  /* ── Large masonry gallery (two columns, each image goes in the shorter one) ── */
  const masonryEl = document.getElementById('detailMasonry');
  if (masonryEl && project.gallery && project.gallery.length) {
    masonryEl.hidden = false;
    const colCount = project.galleryColumns || 2;
    const cols = Array.from({ length: colCount }, () => {
      const col = document.createElement('div');
      col.className = 'masonry-col';
      masonryEl.appendChild(col);
      return col;
    });
    const heights = new Array(colCount).fill(0);
    project.gallery.forEach((item, i) => {
      const c = heights.indexOf(Math.min(...heights));
      heights[c] += item.h / item.w;
      const img = makeRevealImg(item.src, project.title);
      img.width  = item.w;
      img.height = item.h;
      img.addEventListener('click', () => openLightbox(i));
      cols[c].appendChild(img);
    });
  }

  /* ── Strips: justified rows under their own heading ── */
  const stripsEl = document.getElementById('detailStrips');
  const STRIP_ROW_HEIGHT = 308;
  if (stripsEl && project.strips && project.strips.length) {
    stripsEl.hidden = false;
    document.getElementById('stripsTitle').textContent = project.stripsTitle || '';
    const rowsEl = document.getElementById('stripsRows');
    const offset = (project.gallery || []).length;
    project.strips.forEach((item, j) => {
      const ratio = item.w / item.h;
      const cell = document.createElement('div');
      cell.className = 'strip-item';
      cell.style.flex = ratio + ' ' + ratio + ' ' + (ratio * STRIP_ROW_HEIGHT) + 'px';
      cell.style.maxWidth = (ratio * STRIP_ROW_HEIGHT * 1.6) + 'px';  // keeps a lone last-row image from stretching full width
      const img = makeRevealImg(item.src, project.title);
      img.width  = item.w;
      img.height = item.h;
      img.addEventListener('click', () => openLightbox(offset + j));
      cell.appendChild(img);
      rowsEl.appendChild(cell);
    });
  }

  /* ── Lightbox ── */
  const lbList = (project.gallery || []).concat(project.strips || []);
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  let lbIndex = 0;
  function showLightbox(i) {
    const list = lbList;
    lbIndex = (i + list.length) % list.length;
    lbImg.src = list[lbIndex].src;
  }
  function openLightbox(i) {
    showLightbox(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = '';
  }
  if (lb && lbList.length) {
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', e => { e.stopPropagation(); showLightbox(lbIndex - 1); });
    document.getElementById('lightboxNext').addEventListener('click', e => { e.stopPropagation(); showLightbox(lbIndex + 1); });
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  showLightbox(lbIndex - 1);
      if (e.key === 'ArrowRight') showLightbox(lbIndex + 1);
    });
  }

  /* ── Process & Pitch ── */
  const pitchEl = document.getElementById('detailPitch');
  if (pitchEl && project.processParagraphs && project.processParagraphs.length) {
    pitchEl.hidden = false;
    if (project.processTitle) document.getElementById('pitchTitle').textContent = project.processTitle;
    const textEl = document.getElementById('pitchText');
    project.processParagraphs.forEach(t => {
      const p = document.createElement('p');
      p.textContent = t;
      textEl.appendChild(p);
    });
    if (project.pitchUrl) {
      const link = document.getElementById('pitchLink');
      link.href = project.pitchUrl;
      link.hidden = false;
      if (project.pitchImage) {
        const imgLink = document.getElementById('pitchImageLink');
        imgLink.href = project.pitchUrl;
        imgLink.hidden = false;
        imgLink.appendChild(makeRevealImg(project.pitchImage, 'Pitch deck — ' + project.title));
      }
    }
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
    '.detail-gallery img, .process-images img, .mockup-images img, .masonry-col img, .pitch-image img, .strip-item img'
  ).forEach(img => observer.observe(img));
})();
