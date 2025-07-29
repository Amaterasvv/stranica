function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("show");
}

    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, {
    threshold: 0.1
  });

document.querySelectorAll('.usluga-card, .work-item').forEach(card => {
  observer.observe(card);
});



document.getElementById("kontakt-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const forma = e.target;
    const porukaEl = document.getElementById("form-message");

    const usluga = document.getElementById("usluga");
    const telefonEl = document.getElementById("telefon");
    let validno = true;

    // Reset svih poruka
    usluga.setCustomValidity("");
    porukaEl.textContent = "";

    // Provjera usluge
    if (usluga.value === "") {
      usluga.setCustomValidity("Molimo odaberite uslugu.");
      usluga.reportValidity();
      validno = false;
    }

    // Provjera telefona
    const brojTelefona = telefonEl.value.trim();
    if (!/^\d{8,15}$/.test(brojTelefona)) {
      porukaEl.textContent = "❗ Unesite ispravan broj telefona (samo brojevi, bez razmaka).";
      porukaEl.style.color = "red";
      validno = false;
    }

    // Provjera ostatka forme
    if (validno && forma.checkValidity()) {
      porukaEl.textContent = "✅ Hvala! Vaš upit je uspješno poslan. Odgovorit ćemo vam uskoro.";
      porukaEl.style.color = "green";
      forma.reset();
    } else if (!porukaEl.textContent) {
      porukaEl.textContent = "❗ Molimo ispunite sva polja ispravno.";
      porukaEl.style.color = "red";
    }
  });


const track = document.querySelector('.slider-track');
let items = document.querySelectorAll('.slider-item');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

let index = 0;
let autoplayInterval;
let itemWidth;

const setupSlider = () => {
  setTimeout(() => {
    items = document.querySelectorAll('.slider-item'); // osvježi u slučaju promjena
    itemWidth = items[0].getBoundingClientRect().width;
    updateSlider();
  }, 100); // 100ms da se DOM stabilizira
};

const updateSlider = () => {
  track.style.transition = 'transform 0.5s ease';
  track.style.transform = `translateX(-${itemWidth * index}px)`;
};

const nextSlide = () => {
  index++;
  if (index >= items.length - 2) {
    index = 0;
  }
  updateSlider();
};

const prevSlide = () => {
  index--;
  if (index < 0) {
    index = items.length - 3;
  }
  updateSlider();
};

const startAutoplay = () => {
  autoplayInterval = setInterval(() => {
    nextSlide();
  }, 4000);
};

const stopAutoplay = () => {
  clearInterval(autoplayInterval);
};

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

[prevBtn, nextBtn, track].forEach(el => {
  el.addEventListener('mouseenter', stopAutoplay);
  el.addEventListener('mouseleave', startAutoplay);
});

window.addEventListener('resize', () => {
  itemWidth = items[0].getBoundingClientRect().width;
  updateSlider();
});

setupSlider();
startAutoplay();


  document.addEventListener("DOMContentLoaded", function () {
    const boxes = document.querySelectorAll('.box');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // pokreće se samo jednom
        }
      });
    }, {
      threshold: 0.2 // 20% elementa mora biti vidljivo da pokrene animaciju
    });

    boxes.forEach(box => {
      observer.observe(box);
    });
  });

    const kartice = document.querySelectorAll('.dojam-kartica');

  const observerr = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vidljivo');
        observerr.unobserve(entry.target); // ukloni da se ne animira opet
      }
    });
  }, {
    threshold: 0.1
  });

  kartice.forEach(kartica => {
    observerr.observe(kartica);
  });

  kartice.forEach((kartica, index) => {
  kartica.style.transitionDelay = `${index * 0.15}s`;
  observerr.observe(kartica);
});
  document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.box');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    boxes.forEach(box => {
      observer.observe(box);
    });
  });

const cards = document.querySelectorAll(".usluge-section .usluga-card");

const animateCards = () => {
  const triggerBottom = window.innerHeight * 0.85;

  cards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    if (cardTop < triggerBottom) {
      card.classList.add("visible");
    }
  });
};


const observer1 = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.fade-in').forEach(el => observer1.observe(el));


  const sliderrr = document.getElementById('budzet');
  const outputtt = document.getElementById('budzet-value');

  const maxValue = 1600;

  sliderrr.addEventListener('input', () => {
    const value = parseInt(sliderrr.value);
    outputtt.textContent = value >= 1500 ? "1500+" : value;
  });



window.addEventListener("scroll", animateCards);
window.addEventListener("load", animateCards);


