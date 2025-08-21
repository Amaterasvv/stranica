// ==================== Kode Black – main.js (robust) ====================
document.addEventListener("DOMContentLoaded", () => {
  // ========== HAMBURGER / OVERLAY ==========
  function toggleMenu() {
    const menu = document.getElementById("mobile-menu");
    const overlay = document.getElementById("overlay");
    if (!menu || !overlay) return;
    menu.classList.toggle("show");
    overlay.classList.toggle("show");
  }
  // expose ako ti treba na onclick=""
  window.toggleMenu = toggleMenu;

  const overlayEl = document.getElementById("overlay");
  if (overlayEl) {
    overlayEl.addEventListener("click", () => {
      const menu = document.getElementById("mobile-menu");
      if (menu) menu.classList.remove("show");
      overlayEl.classList.remove("show");
    });
  }

  // ========== NAVBAR FADE-IN ==========
  const header = document.querySelector(".navbar");
  if (header) header.style.opacity = 1;

  // ========== INTERSECTION OBSERVERS ==========
  const ioReveal = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("show")),
    { threshold: 0.1 }
  );
  document.querySelectorAll(".usluga-card, .work-item").forEach((el) => ioReveal.observe(el));

  // box / dojam-kartica s odgodom
  const boxes = document.querySelectorAll(".box");
  if (boxes.length) {
    const ioBoxes = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            ioBoxes.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    boxes.forEach((b) => ioBoxes.observe(b));
  }

  const kartice = document.querySelectorAll(".dojam-kartica");
  if (kartice.length) {
    const ioKartice = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vidljivo");
            ioKartice.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    kartice.forEach((k, i) => {
      k.style.transitionDelay = `${i * 0.15}s`;
      ioKartice.observe(k);
    });
  }

  // ========== PRIKAZ KARTICA USLUGA NA SCROLL ==========
  const cards = document.querySelectorAll(".usluge-section .usluga-card");
  function animateCards() {
    if (!cards.length) return;
    const triggerBottom = window.innerHeight * 0.85;
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < triggerBottom) card.classList.add("visible");
    });
  }
  window.addEventListener("scroll", animateCards);
  animateCards();

  // ========== VALIDACIJA KONTAKT FORME ==========
  const kontaktForm = document.getElementById("kontakt-form");
  if (kontaktForm) {
    kontaktForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const forma = e.target;
      const porukaEl = document.getElementById("form-message");
      const usluga = document.getElementById("usluga");
      const telefonEl = document.getElementById("telefon");

      let validno = true;
      if (usluga) {
        usluga.setCustomValidity("");
        if (usluga.value === "") {
          usluga.setCustomValidity("Molimo odaberite uslugu.");
          usluga.reportValidity();
          validno = false;
        }
      }

      if (porukaEl) {
        porukaEl.textContent = "";
      }

      if (telefonEl) {
        const brojTelefona = telefonEl.value.trim();
        if (!/^\d{8,15}$/.test(brojTelefona)) {
          if (porukaEl) {
            porukaEl.textContent = "❗ Unesite ispravan broj telefona (samo brojevi, bez razmaka).";
            porukaEl.style.color = "red";
          }
          validno = false;
        }
      }

      if (validno && forma.checkValidity()) {
        if (porukaEl) {
          porukaEl.textContent = "✅ Hvala! Vaš upit je uspješno poslan. Odgovorit ćemo vam uskoro.";
          porukaEl.style.color = "green";
        }
        forma.reset();
      } else if (porukaEl && !porukaEl.textContent) {
        porukaEl.textContent = "❗ Molimo ispunite sva polja ispravno.";
        porukaEl.style.color = "red";
      }
    });
  }

  // ========== RANGE -> BUDŽET PRIKAZ ==========
  const sliderBudzet = document.getElementById("budzet");
  const outputBudzet = document.getElementById("budzet-value");
  if (sliderBudzet && outputBudzet) {
    const syncBudzet = () => {
      const value = parseInt(sliderBudzet.value, 10);
      outputBudzet.textContent = value >= 1500 ? "1500+" : value;
    };
    sliderBudzet.addEventListener("input", syncBudzet);
    syncBudzet();
  }

  // ========== HORIZONTALNI SLIDER (loop) ==========
  const sliderTrackWrapper = document.getElementById("sliderTrack");
  if (sliderTrackWrapper) {
    // originalni items
    const originals = Array.from(sliderTrackWrapper.children);
    const totalSliderItems = originals.length;

    if (totalSliderItems > 0) {
      // dupliraj za loop
      originals.forEach((card) => {
        sliderTrackWrapper.appendChild(card.cloneNode(true));
      });

      let sliderIndex = 0;
      let intervalId = null;

      const slideOnce = () => {
        const items = sliderTrackWrapper.children; // live HTMLCollection
        const current = items[sliderIndex];
        if (!current) return;

        const offset = current.offsetLeft;
        sliderTrackWrapper.style.transition = "transform 0.5s ease";
        sliderTrackWrapper.style.transform = `translateX(-${offset}px)`;

        sliderIndex++;

        // kad pređemo jedan set (original length), reset bez trzaja
        if (sliderIndex >= totalSliderItems + 1) {
          setTimeout(() => {
            sliderTrackWrapper.style.transition = "none";
            sliderTrackWrapper.style.transform = "translateX(0)";
            sliderIndex = 0;
          }, 510);
        }
      };

      // pokreni auto
      const start = () => {
        if (intervalId) return;
        intervalId = setInterval(slideOnce, 3000);
      };
      const stop = () => {
        if (!intervalId) return;
        clearInterval(intervalId);
        intervalId = null;
      };

      // automatski start
      start();

      // pause on hover (ako želiš)
      sliderTrackWrapper.addEventListener("mouseenter", stop);
      sliderTrackWrapper.addEventListener("mouseleave", start);

      // na resize malo “poravnaj” poziciju
      window.addEventListener("resize", () => {
        sliderTrackWrapper.style.transition = "none";
        const items = sliderTrackWrapper.children;
        const current = items[Math.min(sliderIndex, items.length - 1)];
        const offset = current ? current.offsetLeft : 0;
        sliderTrackWrapper.style.transform = `translateX(-${offset}px)`;
      });
    }
  }
});
