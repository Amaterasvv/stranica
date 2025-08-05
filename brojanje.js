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
