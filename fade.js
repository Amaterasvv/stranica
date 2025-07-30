
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.getAttribute('target') !== '_blank' && !link.href.includes('#')) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.classList.add('fade-out');
        const href = this.getAttribute('href');
        setTimeout(() => {
          window.location.href = href;
        }, 400); 
      });
    }
  });
});
