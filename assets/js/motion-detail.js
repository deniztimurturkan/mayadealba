/**
 * motion-detail.js — reads ?id= from URL, populates the motion detail page
 */
(function () {
  'use strict';

  const params    = new URLSearchParams(window.location.search);
  const projectId = params.get('id');
  const project   = (siteData.motionProjects || []).find(p => p.id === projectId);

  const titleEl   = document.getElementById('mdTitle');
  const labelEl   = document.getElementById('mdLabel');
  const descEl    = document.getElementById('mdDescription');
  const videoWrap = document.getElementById('mdVideoWrap');

  if (!project) {
    if (titleEl) titleEl.textContent = 'Project not found.';
    if (descEl)  descEl.textContent  = 'Return to Motion to browse all projects.';
    return;
  }

  /* Page metadata */
  document.title = project.title + ' — Maya de Alba';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = project.description || '';

  /* Text */
  if (labelEl) labelEl.textContent = 'Motion';
  if (titleEl) titleEl.textContent = project.title;
  if (descEl && project.description) descEl.textContent = project.description;

  /* Footer links */
  const emailEl = document.getElementById('footerEmail');
  const igEl    = document.getElementById('footerInstagram');
  if (emailEl && siteData.email) emailEl.href = 'mailto:' + siteData.email;
  if (igEl && siteData.instagram) igEl.href = siteData.instagram;

  /* Video — iframe for YouTube/Vimeo, <video> for direct files */
  if (videoWrap && project.video) {
    const isEmbed = /youtube\.com|youtu\.be|vimeo\.com/.test(project.video);

    if (isEmbed) {
      const iframe = document.createElement('iframe');
      iframe.src             = project.video;
      iframe.title           = project.title;
      iframe.allow           = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      videoWrap.appendChild(iframe);
    } else {
      const video = document.createElement('video');
      video.src      = project.video;
      video.controls = true;
      video.preload  = 'metadata';
      videoWrap.appendChild(video);
    }
  }
})();
