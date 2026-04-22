/**
 * nav.js — active link highlighting + mobile hamburger menu
 */

function setActiveNav() {
  const filename = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.site-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === filename || (filename === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
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

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initMobileNav();
});
