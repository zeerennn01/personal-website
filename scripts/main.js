/* ============================================================
   SHARED JAVASCRIPT
   main.js — Navbar, Toast, Scroll Animations, Skills
   ============================================================ */

/* ── Toast Notification System ── */
const Toast = (() => {
  const icons = {
    success: '✅',
    info:    '💡',
    warning: '⚠️',
    error:   '❌',
    welcome: '👋',
  };

  function show({ type = 'info', title, message, duration = 4500 }) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const progressId = `progress-${Date.now()}`;

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || '💬'}</span>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
      <button class="toast-close" onclick="this.closest('.toast').remove()">✕</button>
      <div class="toast-progress" id="${progressId}" style="animation-duration:${duration}ms;"></div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  return { show };
})();

/* ── Navbar Scroll Effect ── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });

    // Close on link click
    links.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  // Mark active page
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ── Scroll Fade-Up Animation ── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* ── Skill Bar Animation ── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const level = fill.dataset.level || '0';
        setTimeout(() => { fill.style.width = level + '%'; }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ── Number Counter Animation ── */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
          } else {
            el.textContent = current + suffix;
          }
        }, 25);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ── Gallery Lightbox ── */
function initGalleryLightbox() {
  const modal = document.getElementById('lightbox');
  if (!modal) return;

  const modalImg = modal.querySelector('#lb-img');
  const modalCap = modal.querySelector('#lb-cap');
  const closeBtn = modal.querySelector('#lb-close');

  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      modalImg.src   = img.src;
      modalImg.alt   = img.alt;
      modalCap.textContent = img.alt;
      modal.classList.add('open');
      Toast.show({ type: 'info', title: 'Gallery', message: 'Use ← → keys to navigate.' });
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });
}

/* ── Contact Form ── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      form.reset();
      Toast.show({
        type: 'success',
        title: 'Message Sent!',
        message: 'Thank you! I'll get back to you soon.'
      });
    }, 1800);
  });
}

/* ── Copy Email ── */
function initCopyEmail() {
  const emailBtns = document.querySelectorAll('[data-copy-email]');
  emailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.dataset.copyEmail;
      navigator.clipboard.writeText(email).then(() => {
        Toast.show({
          type: 'success',
          title: 'Copied!',
          message: `${email} copied to clipboard.`
        });
      });
    });
  });
}

/* ── Init All ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initSkillBars();
  initCounters();
  initGalleryLightbox();
  initContactForm();
  initCopyEmail();
});
