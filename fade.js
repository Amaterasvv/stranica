window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.classList.add("fade-out");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 750);
  }, 1500);

  // Dodaj 'loaded' klasu slikama kad su spremne
  document.querySelectorAll('.project-image-wrapper img').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.onload = () => img.classList.add('loaded');
    }
  });

const slider1 = document.getElementById("sliderContainer");
let currentIndex1 = 0;
let slideWidth1 = 0;
let slidesPerView1 = 1;
let totalSlides1 = 0;
let maxIndex1 = 0;
let autoTimer1 = null;

function measure1() {
  const firstCard = slider1.querySelector(".slide1");
  if (!firstCard) return false;

  // Stvarni razmak (gap) iz CSS-a
  const s = getComputedStyle(slider1);
  const gap = parseFloat(s.columnGap || s.gap || 0);

  // Širina kartice uključujući gap
  const cardWidth = firstCard.getBoundingClientRect().width;
  slideWidth1 = cardWidth + gap;

  // Koliko realno stane u viewport slidera (1, 2, 3…)
  slidesPerView1 = Math.max(1, Math.round((slider1.clientWidth + gap) / slideWidth1));

  totalSlides1 = slider1.querySelectorAll(".slide1").length;
  maxIndex1 = Math.max(0, totalSlides1 - slidesPerView1);
  return true;
}

function snapToIndex1(behavior = "smooth") {
  slider1.scrollTo({
    left: slideWidth1 * currentIndex1,
    behavior
  });
}

function autoSlide1() {
  if (!measure1()) return;
  currentIndex1 = currentIndex1 >= maxIndex1 ? 0 : currentIndex1 + 1;
  snapToIndex1("smooth");
}

function startAuto1() {
  stopAuto1();
  autoTimer1 = setInterval(autoSlide1, 4000);
}
function stopAuto1() {
  if (autoTimer1) clearInterval(autoTimer1);
}

// Inicijalno mjerenje i pokretanje
measure1();
snapToIndex1("auto");
startAuto1();

// Reflow na resize (debounce)
let resizeTO;
window.addEventListener("resize", () => {
  clearTimeout(resizeTO);
  resizeTO = setTimeout(() => {
    const prevIndex = currentIndex1;
    measure1();
    // Re-pozicioniraj bez animacije (da ne “pleše”)
    currentIndex1 = Math.min(prevIndex, maxIndex1);
    snapToIndex1("auto");
  }, 120);
});

// (Po želji) pauza dok je tab neaktivan – štedi CPU i sprječava “iskakanje”
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopAuto1();
  else startAuto1();
});


  // 👉 ANIMACIJA OKVIRA kad uđu u viewport
  const okviri = document.querySelectorAll('.okvir');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.3
  });

  okviri.forEach(okvir => observer.observe(okvir));


  // ====== DODATAK: PRVI TAP NA MOBITELU PRIKAŽI TITLE, DRUGI TAP OTVORI LINK ======
  document.querySelectorAll('.grid-item').forEach(item => {
    let tappedOnce = false;

    item.addEventListener('click', function(event) {
      if(window.innerWidth <= 768) {
        if(!tappedOnce) {
          event.preventDefault(); // spriječi odmah otvaranje linka
          tappedOnce = true;

          const title = item.querySelector('.project-title');
          if (title) {
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
          }

          // Sakrij title nakon 3 sekunde ako se ne klikne opet
          setTimeout(() => {
            tappedOnce = false;
            if (title) {
              title.style.opacity = '';
              title.style.transform = '';
            }
          }, 3000);
        } 
        // ako je tappedOnce true, dopusti otvaranje linka (drugi tap)
      }
    });

    // Klik izvan elementa resetira stanje i skriva title
    document.addEventListener('click', (e) => {
      if(!item.contains(e.target)) {
        tappedOnce = false;
        const title = item.querySelector('.project-title');
        if (title) {
          title.style.opacity = '';
          title.style.transform = '';
        }
      }
    });
  });

});
  document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector(".typing-text");
    const sub = document.querySelector(".typing-sub");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          title.classList.add("active");
          sub.classList.add("active");
          observer.unobserve(entry.target); // pokrene se samo jednom
        }
      });
    }, { threshold: 0.6 }); // 60% sekcije mora ući u viewport

    observer.observe(document.querySelector(".mini-banner"));
  });