document.addEventListener('DOMContentLoaded', () => {
  const storageKey = 'devnux.language';

  document.querySelectorAll('[data-language]').forEach(link => {
    link.addEventListener('click', () => {
      const language = link.dataset.language;
      if (['pt', 'en', 'es'].includes(language)) localStorage.setItem(storageKey, language);
    });
  });

  const sections = Array.from(document.querySelectorAll('main section'));
  if (!("IntersectionObserver" in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  sections.forEach(section => section.classList.add('reveal-ready'));
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  sections.forEach(section => observer.observe(section));
});
