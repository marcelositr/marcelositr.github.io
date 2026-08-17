document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const storageKey = 'devnux.language';

  document.querySelectorAll('[data-language]').forEach(link => {
    link.addEventListener('click', () => {
      const language = link.dataset.language;
      if (['pt', 'en', 'es'].includes(language)) localStorage.setItem(storageKey, language);
    });
  });

  document.querySelectorAll('[data-age][data-birth]').forEach(node => {
    const [year, month] = node.dataset.birth.split('-').map(Number);
    if (!year || !month) return;

    const now = new Date();
    const age = now.getFullYear() - year - ((now.getMonth() + 1) < month ? 1 : 0);
    const lang = document.documentElement.lang.toLowerCase();
    const unit = lang.startsWith('en') ? 'years' : lang.startsWith('es') ? 'años' : 'anos';
    node.textContent = `${age} ${unit}`;
  });

  document.querySelectorAll('[data-current-year]').forEach(node => {
    node.textContent = String(new Date().getFullYear());
  });

  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (!("IntersectionObserver" in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sections = Array.from(document.querySelectorAll('main section'));
  sections.forEach(section => section.classList.add('reveal-ready'));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

  sections.forEach(section => observer.observe(section));
});
