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
  switchTab('home');
  galleryInit();
  console.log('Eastminster Presbyterian Church website loaded.');
});

// =============================================
//  GALLERY CAROUSEL  (global scope)
// =============================================
var _gallery = {
  current: 0,
  timer: null,
  INTERVAL: 4000,
  slides: []
};

function galleryInit() {
  var thumbEls = document.querySelectorAll('.gallery-thumb');
  var mainImg  = document.getElementById('gallery-main-img');
  if (!thumbEls.length || !mainImg) return;

  _gallery.slides = Array.from(thumbEls).map(function(th) {
    return { src: th.getAttribute('data-src'), caption: th.getAttribute('data-caption'), el: th };
  });

  // Build dots
  var dotsWrap = document.getElementById('gallery-dots');
  if (dotsWrap) {
    _gallery.slides.forEach(function(_, i) {
      var dot = document.createElement('button');
      dot.className   = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Photo ' + (i + 1));
      dot.onclick     = function() { galleryGo(i); };
      dotsWrap.appendChild(dot);
    });
  }

  // Start auto-cycle
  galleryStartAuto();
}

function galleryGo(index) {
  var g = _gallery;
  if (!g.slides.length) return;
  if (index === g.current) return;

  var mainImg   = document.getElementById('gallery-main-img');
  var captionEl = document.getElementById('gallery-main-caption');
  if (!mainImg) return;

  // Fade out → swap → fade in
  mainImg.style.opacity = '0';
  setTimeout(function() {
    mainImg.src           = g.slides[index].src;
    mainImg.alt           = g.slides[index].caption;
    if (captionEl) captionEl.textContent = g.slides[index].caption;

    // Active thumb
    g.slides.forEach(function(s, i) { s.el.classList.toggle('active', i === index); });

    // Active dot
    var dots = document.querySelectorAll('.gallery-dot');
    dots.forEach(function(d, i) { d.classList.toggle('active', i === index); });

    g.current = index;
    mainImg.style.opacity = '1';
  }, 280);
}

function galleryPrev() {
  var g = _gallery;
  galleryStopAuto();
  galleryGo((g.current - 1 + g.slides.length) % g.slides.length);
  galleryStartAuto();
}

function galleryNext() {
  var g = _gallery;
  galleryStopAuto();
  galleryGo((g.current + 1) % g.slides.length);
  galleryStartAuto();
}

function galleryStartAuto() {
  galleryStopAuto();
  _gallery.timer = setInterval(function() {
    var g = _gallery;
    galleryGo((g.current + 1) % g.slides.length);
  }, _gallery.INTERVAL);
}

function galleryStopAuto() {
  clearInterval(_gallery.timer);
  _gallery.timer = null;
}
