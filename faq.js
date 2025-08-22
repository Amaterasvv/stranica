// faq.js — final (capture-phase click + robust open/close)
(() => {
  'use strict';

  const BUFFER = 8;                 // malo lufta da ne “odreže” dno
  const ONLY_ONE_OPEN = false;      // stavi true ako želiš da je uvijek samo jedna otvorena

  function ensureStyles() {
    if (document.getElementById('kbfaq-style')) return;
    const s = document.createElement('style');
    s.id = 'kbfaq-style';
    s.textContent = `
      .faq .faq-q{display:flex;align-items:center;gap:12px;padding:14px 16px;width:100%;
        background:transparent;border:0;text-align:left;cursor:pointer}
      .faq .faq-q .chev{margin-left:auto;transition:transform .28s cubic-bezier(.22,.61,.36,1),opacity .2s}
      .faq li.open .faq-q .chev{transform:rotate(180deg);opacity:1}
      .faq .faq-a{display:block !important;overflow:hidden;max-height:0;opacity:0;box-sizing:border-box;
        transition:max-height .34s cubic-bezier(.22,.61,.36,1),opacity .25s ease}
      .faq li.open .faq-a{opacity:1}
    `;
    document.head.appendChild(s);
  }

  function getUl() {
    // precizniji selektor (ako imaš više FAQ-ova)
    return document.querySelector('section#pomoc .faq ul') || document.querySelector('.faq ul');
  }

  // Ako markup NIJE wrapan, wrapamo ga (radi i s <strong> i s <br>)
  function wrapIfNeeded(ul) {
    let wrapped = 0;
    [...ul.children].forEach((li, i) => {
      if (li.querySelector('.faq-q') && li.querySelector('.faq-a')) return; // već ok

      let questionText = '';
      const panel = document.createElement('div');
      panel.className = 'faq-a';
      panel.id = `faq-a-${i+1}`;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-hidden', 'true');
      panel.style.maxHeight = '0';
      panel.style.overflow = 'hidden';

      const strong = li.querySelector('strong');

      if (strong) {
        questionText = (strong.textContent || '').trim();
        let node = strong.nextSibling, skipped = false;
        while (node) {
          const next = node.nextSibling;
          if (!skipped && node.nodeType === 1 && node.nodeName === 'BR') { skipped = true; }
          else { panel.appendChild(node); }
          node = next;
        }
        strong.remove();
      } else {
        const nodes = Array.from(li.childNodes);
        const brIdx = nodes.findIndex(n => n.nodeType === 1 && n.nodeName === 'BR');
        if (brIdx === -1) {
          questionText = (li.textContent || '').trim();
        } else {
          questionText = nodes.slice(0, brIdx).map(n => n.textContent).join('').trim();
          nodes.slice(brIdx + 1).forEach(n => panel.appendChild(n));
        }
      }
      if (!questionText) questionText = 'Pitanje';

      if (panel.firstChild && panel.firstChild.nodeType === Node.TEXT_NODE) {
        const p = document.createElement('p');
        p.textContent = panel.firstChild.textContent.trim();
        panel.replaceChild(p, panel.firstChild);
      }

      const btn = document.createElement('button');
      btn.className = 'faq-q';
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', panel.id);
      btn.innerHTML = `${questionText}<span class="chev">▼</span>`;

      li.replaceChildren(btn, panel);
      wrapped++;
    });
    return wrapped;
  }

  function openItem(btn, ul) {
    const li = btn.closest('li');
    const panel = li && li.querySelector('.faq-a');
    if (!panel) return;

    if (ONLY_ONE_OPEN) {
      ul.querySelectorAll('li.open .faq-q').forEach(b => {
        if (b !== btn) closeItem(b);
      });
    }

    li.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');

    panel.style.maxHeight = '0px';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target = panel.scrollHeight + BUFFER;
        const onEnd = (e) => {
          if (e.propertyName !== 'max-height') return;
          panel.style.maxHeight = 'none';   // “auto”
          panel.removeEventListener('transitionend', onEnd);
        };
        panel.addEventListener('transitionend', onEnd);
        panel.style.maxHeight = target + 'px';
      });
    });
  }

  function closeItem(btn) {
    const li = btn.closest('li');
    const panel = li && li.querySelector('.faq-a');
    if (!panel) return;

    const current = Math.ceil(panel.getBoundingClientRect().height);
    panel.style.maxHeight = current + 'px';
    panel.getBoundingClientRect(); // reflow

    btn.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    li.classList.remove('open');

    requestAnimationFrame(() => { panel.style.maxHeight = '0px'; });
  }

  function init() {
    ensureStyles();

    const ul = getUl();
    if (!ul) { console.warn('[FAQ] .faq ul nije nađen'); return; }

    const wrapped = wrapIfNeeded(ul);
    const clickable = ul.querySelectorAll('.faq-q').length;
    console.log(`[FAQ] wrapped: ${wrapped} | clickable: ${clickable}`);

    // 1) Delegirani klik NA UL (bubble)
    ul.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq-q');
      if (!btn || !ul.contains(btn)) return;
      e.preventDefault();
      (btn.getAttribute('aria-expanded') === 'true') ? closeItem(btn) : openItem(btn, ul);
    });

    // 2) Sigurnosni handler u CAPTURE fazi na DOCUMENT razini:
    //    hvata klik prije nego što ga neka druga skripta zaustavi (stopPropagation).
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq-q');
      if (!btn || !ul.contains(btn)) return;
      // ako UL već hendla, ovo će biti suvišno, ali je “safety net”
      e.preventDefault();
      e.stopPropagation(); // zaustavi skripte koje bi mogle spriječiti otvaranje
      (btn.getAttribute('aria-expanded') === 'true') ? closeItem(btn) : openItem(btn, ul);
    }, true); // <-- capture faza

    // resize održavanje
    window.addEventListener('resize', () => {
      ul.querySelectorAll('li.open .faq-a').forEach(panel => {
        if (panel.style.maxHeight !== 'none') {
          panel.style.maxHeight = panel.scrollHeight + BUFFER + 'px';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
