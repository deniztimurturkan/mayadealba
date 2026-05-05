/**
 * nav.js — active link highlighting + mobile hamburger menu
 */

function setActiveNav() {
  const SECTIONS = ['illustration', 'surface-design', 'motion', 'about', 'surface-detail', 'motion-detail'];
  const parts = window.location.pathname.replace(/\/$/, '').split('/').filter(Boolean);
  const lastPart = parts[parts.length - 1] || '';

  const detailMap = { 'surface-detail': 'surface-design', 'motion-detail': 'motion' };
  const isHome = !SECTIONS.includes(lastPart);
  const activeSection = isHome ? '' : (detailMap[lastPart] || lastPart);

  document.querySelectorAll('.site-nav a').forEach(link => {
    const href = link.getAttribute('href');
    const hrefParts = href.replace(/\/$/, '').split('/').filter(s => s && s !== '..' && s !== '.');
    const linkSection = hrefParts[hrefParts.length - 1] || '';
    if (linkSection === activeSection) {
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

function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initMobileNav();
  injectFooterLinks();
  handleLogoFallback();
  initScrollReveal();
});
