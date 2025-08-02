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

  function autoSlide1() {
    const slide1 = slider1.querySelector('.slide1');
    if (!slide1) return;

    const slideWidth1 = slide1.offsetWidth + 30;
    const slidesPerView1 = window.innerWidth >= 768 ? 2 : 1;
    const totalSlides1 = slider1.querySelectorAll('.slide1').length;
    const maxIndex1 = totalSlides1 - slidesPerView1;

    currentIndex1++;
    if (currentIndex1 > maxIndex1) {
      currentIndex1 = 0;
    }

    slider1.scrollTo({
      left: slideWidth1 * currentIndex1,
      behavior: 'smooth'
    });
  }

  setInterval(autoSlide1, 4000);

  window.addEventListener("resize", () => {
    const slide1 = slider1.querySelector('.slide1');
    if (!slide1) return;

    const slideWidth1 = slide1.offsetWidth + 30;
    slider1.scrollTo({
      left: slideWidth1 * currentIndex1,
      behavior: 'auto'
    });
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
