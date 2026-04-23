/**
 * nav.js — active link highlighting + mobile hamburger menu
 */

function setActiveNav() {
  const filename = window.location.pathname.split('/').pop() || 'index.html';

  // surface-detail.html is a sub-page of surface-design.html
  const activeFile = filename === 'surface-detail.html' ? 'surface-design.html' : filename;

  document.querySelectorAll('.site-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === activeFile || (activeFile === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function handleLogoFallback() {
  const logo = document.querySelector('.site-logo');
  if (!logo) return;
  logo.addEventListener('error', () => {
    logo.style.display = 'none';
  });
}

function injectFooterLinks() {
  if (typeof siteData === 'undefined') return;

  document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
    if (siteData.email) el.href = 'mailto:' + siteData.email;
  });

  // Only update Instagram links that are the placeholder
  document.querySelectorAll('a[href="https://instagram.com/"]').forEach(el => {
    if (siteData.instagram) el.href = siteData.instagram;
  });
}

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  function openNav() {
    nav.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.textContent = '✕';
  }

  function closeNav() {
    nav.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }

  toggle.addEventListener('click', () => {
    nav.classList.contains('nav-open') ? closeNav() : openNav();
  });

  // Close when a link is tapped
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      closeNav();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
      closeNav();
      toggle.focus();
    }
  });
}

function initScrollHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const THRESHOLD = 60;

  function update() {
    header.classList.toggle('header-scrolled', window.scrollY > THRESHOLD);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initMobileNav();
  injectFooterLinks();
  handleLogoFallback();
  initScrollHeader();
});
