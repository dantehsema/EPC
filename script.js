// =============================================
//  EASTMINSTER PRESBYTERIAN CHURCH
//  Main JavaScript
// =============================================

/**
 * Switch between the two main tabs:
 * 'home' => About Us
 * 'events' => Events & Calendar
 */
function switchTab(tab) {
  const panels = document.querySelectorAll('.tab-panel');
  const buttons = document.querySelectorAll('.tab-btn');

  panels.forEach(p => p.classList.remove('active'));
  buttons.forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });

  const targetPanel = document.getElementById(`tab-${tab}`);
  const targetBtn   = document.getElementById(`tab-${tab}-btn`);

  if (targetPanel) targetPanel.classList.add('active');
  if (targetBtn) {
    targetBtn.classList.add('active');
    targetBtn.setAttribute('aria-selected', 'true');
  }

  // Scroll to just below the header
  const header = document.querySelector('.site-header');
  const offset = header ? header.offsetHeight : 70;
  const hero   = document.getElementById('hero-section');

  // If we're past the hero, scroll to content top; otherwise stay
  if (window.scrollY > (hero ? hero.offsetHeight * 0.5 : 400)) {
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }
}

// =============================================
//  HEADER SHADOW ON SCROLL
// =============================================
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 4px 32px rgba(0,0,0,0.4)';
    } else {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// =============================================
//  INTERSECTION OBSERVER – FADE IN CARDS
// =============================================
(function () {
  const targets = document.querySelectorAll('.info-card, .appt-card, .gallery-item, .denom-card');
  if (!('IntersectionObserver' in window) || targets.length === 0) return;

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();

// =============================================
//  GOOGLE MAPS EMBED – fallback & refresh
// =============================================
(function () {
  const mapIframe = document.querySelector('#church-map iframe');
  if (!mapIframe) return;

  // Use the official Maps Embed API with the actual address
  const query = encodeURIComponent('5601 Randolph Street, Hyattsville, MD 20784');
  mapIframe.src = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
})();

// =============================================
//  INIT
// =============================================
document.addEventListener('DOMContentLoaded', function () {
  // Ensure home tab is active by default
  switchTab('home');
  console.log('Eastminster Presbyterian Church website loaded.');
});
