function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("overlay");

  menu.classList.toggle("show");
  overlay.classList.toggle("show");
}

document.getElementById("overlay").addEventListener("click", () => {
  document.getElementById("mobile-menu").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
});

window.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".navbar");
  header.style.opacity = 1;
});

// Animacija ulaska elemenata
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.usluga-card, .work-item').forEach(card => {
  observer.observe(card);
});

// Validacija kontakt forme
document.getElementById("kontakt-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const forma = e.target;
  const porukaEl = document.getElementById("form-message");

  const usluga = document.getElementById("usluga");
  const telefonEl = document.getElementById("telefon");
  let validno = true;

  usluga.setCustomValidity("");
  porukaEl.textContent = "";

  if (usluga.value === "") {
    usluga.setCustomValidity("Molimo odaberite uslugu.");
    usluga.reportValidity();
    validno = false;
  }

  const brojTelefona = telefonEl.value.trim();
  if (!/^\d{8,15}$/.test(brojTelefona)) {
    porukaEl.textContent = "❗ Unesite ispravan broj telefona (samo brojevi, bez razmaka).";
    porukaEl.style.color = "red";
    validno = false;
  }

  if (validno && forma.checkValidity()) {
    porukaEl.textContent = "✅ Hvala! Vaš upit je uspješno poslan. Odgovorit ćemo vam uskoro.";
    porukaEl.style.color = "green";
    forma.reset();
  } else if (!porukaEl.textContent) {
    porukaEl.textContent = "❗ Molimo ispunite sva polja ispravno.";
    porukaEl.style.color = "red";
  }
});

// Animacija za .box i .dojam-kartica
document.addEventListener("DOMContentLoaded", function () {
  const boxes = document.querySelectorAll('.box');
  const kartice = document.querySelectorAll('.dojam-kartica');

  const observerBoxes = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerBoxes.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  boxes.forEach(box => observerBoxes.observe(box));

  const observerKartice = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vidljivo');
        observerKartice.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  kartice.forEach((kartica, index) => {
    kartica.style.transitionDelay = `${index * 0.15}s`;
    observerKartice.observe(kartica);
  });
});

// Prikaz kartica usluga
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

window.addEventListener("scroll", animateCards);
window.addEventListener("load", animateCards);

// Prikaz vrijednosti budžeta
const sliderrr = document.getElementById('budzet');
const outputtt = document.getElementById('budzet-value');

sliderrr.addEventListener('input', () => {
  const value = parseInt(sliderrr.value);
  outputtt.textContent = value >= 1500 ? "1500+" : value;
});


   const sliderTrackWrapper = document.getElementById('sliderTrack');
  const sliderCards = [...sliderTrackWrapper.children];
  const totalSliderItems = sliderCards.length;

  // Dupliraj sadržaj za glatki loop efekt
  sliderCards.forEach(card => {
    const clone = card.cloneNode(true);
    sliderTrackWrapper.appendChild(clone);
  });

  let sliderIndex = 0;

  function slideSlider() {
    const currentCard = sliderTrackWrapper.children[sliderIndex];
    
    if (!currentCard) return;

    const offset = currentCard.offsetLeft;

    sliderTrackWrapper.style.transition = 'transform 0.5s ease';
    sliderTrackWrapper.style.transform = `translateX(-${offset}px)`;

    sliderIndex++;

    if (sliderIndex >= totalSliderItems + 1) {
      // Reset loop
      setTimeout(() => {
        sliderTrackWrapper.style.transition = 'none';
        sliderTrackWrapper.style.transform = 'translateX(0)';
        sliderIndex = 0;
      }, 510); // pričekaj dok animacija završi
    }
  }

  setInterval(slideSlider, 3000); // slide svakih 3 sekunde

