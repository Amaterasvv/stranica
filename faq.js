// faq.js  — ČISTI JS, bez <script> tagova!

/* =========================
   FAQ interakcije + brojači
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[FAQ] init');

  // ====== FAQ auto-wrap ======
  const faqRoot = document.querySelector('.faq ul');
  if (!faqRoot) {
    console.warn('[FAQ] .faq ul nije nađen — provjeri HTML');
  } else {
    [...faqRoot.children].forEach((li, idx) => {
      if (li.querySelector('.faq-q')) return;

      const html = (li.innerHTML || '').trim();
      let splitAt = html.toLowerCase().indexOf('<br');
      if (splitAt === -1) {
        const strongEnd = html.toLowerCase().indexOf('</strong>');
        splitAt = strongEnd !== -1 ? strongEnd + 9 : html.length;
      }
      const qHTML = html.slice(0, splitAt).trim();
      const aHTML = html.slice(splitAt).replace(/^<br\s*\/?>/i, '').trim();

      const btn = document.createElement('button');
      btn.className = 'faq-q';
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      const aId = `faq-a-${idx+1}`;
      btn.setAttribute('aria-controls', aId);
      btn.innerHTML = qHTML + '<span class="chev">▼</span>';

      const ans = document.createElement('div');
      ans.className = 'faq-a';
      ans.id = aId;
      ans.setAttribute('role', 'region');
      ans.setAttribute('aria-hidden', 'true');
      ans.innerHTML = aHTML ? `<p>${aHTML}</p>` : '';

      li.innerHTML = '';
      li.appendChild(btn);
      li.appendChild(ans);
    });

    // ====== Open/close animacija ======
    const items = faqRoot.querySelectorAll('li');
    items.forEach(li => {
      const btn = li.querySelector('.faq-q');
      const panel = li.querySelector('.faq-a');
      if (!btn || !panel) return;

      const open = () => {
        li.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');
        panel.style.height = '0px';
        panel.getBoundingClientRect(); // reflow
        panel.style.height = panel.scrollHeight + 'px';
        const onEnd = (e) => {
          if (e.propertyName !== 'height') return;
          panel.style.height = 'auto';
          panel.removeEventListener('transitionend', onEnd);
        };
        panel.addEventListener('transitionend', onEnd);
      };

      const close = () => {
        btn.setAttribute('aria-expanded', 'false');
        li.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        if (panel.style.height === 'auto') {
          panel.style.height = panel.scrollHeight + 'px';
        }
        panel.getBoundingClientRect(); // reflow
        panel.style.height = '0px';
      };

      btn.addEventListener('click', () => {
        const isOpen = li.classList.contains('open');
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          li.classList.toggle('open');
          const expanded = li.classList.contains('open');
          btn.setAttribute('aria-expanded', expanded);
          panel.setAttribute('aria-hidden', String(!expanded));
          panel.style.height = expanded ? 'auto' : '0px';
          return;
        }
        isOpen ? close() : open();
      });

      panel.style.height = '0px';
    });
  }

  // ====== Brojači ======
  const counters = document.querySelectorAll('.support-stats-wide .count');
  if (counters.length) {
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.target || '0');
      const dur = 1200;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = String(Math.round(easeOutCubic(p) * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          animateCounter(en.target);
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.35 });
    counters.forEach(c => io.observe(c));
  }

  console.log('[FAQ] ready');
});


/* =========================
   THEME TOGGLE (IIFE)
   Radi s <link id="theme-link"> i <button id="theme-toggle"><i class="..."></i></button>
   Opcionalno mijenja <img id="brand-logo" data-dark="..." data-light="...">
   ========================= */
(function () {
  'use strict';

  // ---- Putanje CSS-a
  var DARK_HREF  = 'style.css';
  var LIGHT_HREF = 'lightstyle.css';

  // Helper: provjerava je li href već pokazuje na light CSS
  function isLightHref(href) {
    if (!href) return false;
    return /(^|\/)lightstyle\.css(\?|#|$)/.test(href);
  }

  // Helper: localStorage
  function getSavedTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  function setSavedTheme(val) {
    try { localStorage.setItem('theme', val); } catch (e) {}
  }

  // Primjena teme
  function applyTheme(theme, opts) {
    opts = opts || {};
    var link = document.getElementById('theme-link');
    if (!link) return;

    var targetHref = theme === 'light' ? LIGHT_HREF : DARK_HREF;
    if (link.getAttribute('href') !== targetHref) {
      link.setAttribute('href', targetHref);
    }

    // Klase na body
    if (document.body) {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(theme);
    }

    // Zamjena loga (ako postoji)
    var logo = document.getElementById('brand-logo');
    if (logo) {
      var nextSrc = (theme === 'light') ? logo.getAttribute('data-light') : logo.getAttribute('data-dark');
      if (nextSrc) logo.src = nextSrc;
    }

    // Ažuriraj toggle ikonu (Font Awesome)
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      var icon = btn.querySelector('i'); // prva ikona unutar gumba
      if (icon) {
        if (theme === 'light') {
          icon.className = 'fa-solid fa-moon'; // prikaz za prelazak na dark
          btn.setAttribute('aria-label', 'Prebaci na dark');
        } else {
          icon.className = 'fa-solid fa-sun';  // prikaz za prelazak na light
          btn.setAttribute('aria-label', 'Prebaci na light');
        }
      }
    }

    // Spremi preferenciju (osim ako je skipSave)
    if (!opts.skipSave) {
      setSavedTheme(theme);
    }
  } // <-- KRAJ applyTheme

  // Init kad je DOM spreman
  function onReady() {
    var link = document.getElementById('theme-link');
    var btn  = document.getElementById('theme-toggle');

    // Ako nema linka ili gumba, izađi tiho (shared skripta)
    if (!link || !btn) return;

    // Početno stanje (sink s trenutnim href-om)
    var initialTheme = isLightHref(link.getAttribute('href')) ? 'light' : 'dark';
    applyTheme(initialTheme, { skipSave: true });

    // Klik za toggle
    btn.addEventListener('click', function () {
      var current = isLightHref(link.getAttribute('href')) ? 'light' : 'dark';
      var next = (current === 'light') ? 'dark' : 'light';
      applyTheme(next);
    });

    // (Opcionalno) prati OS promjenu kad user nije ručno odabrao
    var saved = getSavedTheme();
    if (!saved || (saved !== 'light' && saved !== 'dark')) {
      if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-color-scheme: light)');
        if (mq.addEventListener) {
          mq.addEventListener('change', function (e) {
            applyTheme(e.matches ? 'light' : 'dark');
          });
        } else if (mq.addListener) { // stariji Safari
          mq.addListener(function (e) {
            applyTheme(e.matches ? 'light' : 'dark');
          });
        }
      }
    }

    // Mali API za debug
    window.Theme = {
      apply: function (t) { applyTheme(t); },
      current: function () {
        var href = link.getAttribute('href');
        return isLightHref(href) ? 'light' : 'dark';
      }
    };
  }

  // Pokretanje
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})(); // <-- KRAJ IIFE
