document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll('.count');
  const stats = document.querySelectorAll('.stat');
  let started = false;

  const animateCounters = () => {
    if (started) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(counter => {
            const updateCount = () => {
              const target = +counter.getAttribute('data-target');
              const duration = 2000;
              const startTime = performance.now();

              const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

              const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = easeOutCubic(progress);
                const value = Math.floor(eased * target);

                counter.innerText = value;

                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  counter.innerText = target;
                }
              };

              requestAnimationFrame(animate);
            };

            updateCount();
          });

          // Dodaj klasu za fade-in efekt
          stats.forEach(stat => stat.classList.add('visible'));

          started = true;
          obs.disconnect();
        }
      });
    });

    counters.forEach(counter => observer.observe(counter));
  };

  animateCounters();
});

  const muskaImena = ['Marko', 'Mario', 'Ivan', 'Petar', 'Ante', 'Luka', 'Nikola'];
  const zenskaImena = ['Ana', 'Ivana', 'Marija', 'Katarina', 'Lucija', 'Sara', 'Petra'];

  document.querySelectorAll('.dojam-kartica').forEach(kartica => {
    const autorEl = kartica.querySelector('.autor');
    const ikonaEl = kartica.querySelector('.profil-ikona');
    if (!autorEl || !ikonaEl) return;

    const imePrezime = autorEl.textContent.trim();
    const ime = imePrezime.split(' ')[0];

    if (zenskaImena.includes(ime)) {
      ikonaEl.classList.add('zensko');
    } else if (muskaImena.includes(ime)) {
      ikonaEl.classList.add('musko');
    } else {
      ikonaEl.classList.add('neutralno');
    }
  });


    const paketCards = document.querySelectorAll('.paket-card');

  const observercard = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animira samo jednom
      }
    });
  }, {
    threshold: 0.3
  });

  paketCards.forEach(card => {
    observercard.observe(card);
  });



  (function(){
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries)=>{
      for (const e of entries){
        if (e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); }
      }
    }, {threshold:.14});
    els.forEach(el=>io.observe(el));
  })();



/* FAQ — smooth height animation (px -> auto bez trzanja) */
(function(){
  const items = document.querySelectorAll('.faq ul li');
  if(!items.length) return;

  items.forEach((li, idx)=>{
    if(li.classList.contains('faq-ready')) return;

    // razdvoji Q/A iz postojećeg HTML-a
    const raw = li.innerHTML;
    const brAt = raw.indexOf('<br');
    const qHTML = (brAt !== -1 ? raw.slice(0, brAt) : raw).replace(/<\/?strong>/g,'').trim();
    const aHTML = (brAt !== -1 ? raw.slice(brAt).replace(/^<br.*?>/i,'') : '').trim();

    li.innerHTML = `
      <div class="faq-q" role="button" tabindex="0" aria-expanded="false" aria-controls="faq-a-${idx}">
        <strong>${qHTML}</strong>
        <span class="chev" aria-hidden="true">▾</span>
      </div>
      <div class="faq-a" id="faq-a-${idx}" role="region" aria-hidden="true">${aHTML}</div>
    `;
    li.classList.add('faq-ready');

    const q = li.querySelector('.faq-q');
    const a = li.querySelector('.faq-a');

    const open = () => {
      li.classList.add('open');
      q.setAttribute('aria-expanded','true');
      a.setAttribute('aria-hidden','false');

      // 1) start iz 0
      a.style.height = '0px';
      // prisilni reflow
      void a.offsetHeight;
      // 2) animiraj do scroll visine
      a.style.height = a.scrollHeight + 'px';

      const done = (e) => {
        if(e.propertyName !== 'height') return;
        // 3) fiksiraj na auto bez skoka
        a.style.height = 'auto';
        a.removeEventListener('transitionend', done);
      };
      a.addEventListener('transitionend', done);
    };

    const close = () => {
      q.setAttribute('aria-expanded','false');
      a.setAttribute('aria-hidden','true');

      // ako je 'auto', zamijeni je stvarnom visinom pa animiraj na 0
      a.style.height = a.scrollHeight + 'px';
      // reflow
      void a.offsetHeight;
      a.style.height = '0px';

      const done = (e) => {
        if(e.propertyName !== 'height') return;
        li.classList.remove('open');
        a.removeEventListener('transitionend', done);
      };
      a.addEventListener('transitionend', done);
    };

    const toggle = () => li.classList.contains('open') ? close() : open();

    q.addEventListener('click', toggle);
    q.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); }
      if(e.key === 'ArrowDown'){ e.preventDefault(); li.nextElementSibling?.querySelector('.faq-q')?.focus(); }
      if(e.key === 'ArrowUp'){ e.preventDefault(); li.previousElementSibling?.querySelector('.faq-q')?.focus(); }
    });

    // na resize, recalculiraj visinu ako je otvoren
    window.addEventListener('resize', ()=>{
      if(li.classList.contains('open') && a.style.height === 'auto'){
        a.style.height = a.scrollHeight + 'px';
        // nakon jedne frame, vrati na auto da ostane fluidno
        requestAnimationFrame(()=> a.style.height = 'auto');
      }
    });
  });
})();
