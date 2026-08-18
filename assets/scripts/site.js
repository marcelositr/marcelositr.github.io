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

  document.querySelectorAll('[data-current-year]').forEach(node => { node.textContent = String(new Date().getFullYear()); });

  const langCode = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : document.documentElement.lang.toLowerCase().startsWith('es') ? 'es' : 'pt';
  const textFor = value => typeof value === 'string' ? value : (value?.[langCode] || value?.pt || value?.en || '');
  const galleryKey = (() => {
    const path = location.pathname;
    if (/\/(meio-ambiente|environment)\//.test(path)) return 'environment';
    if (/\/(tecnologia|technology)\//.test(path)) return 'technology';
    if (/\/radio\//.test(path)) return 'radio';
    if (/\/(meliponicultura|meliponiculture)\//.test(path)) return 'meliponiculture';
    if (/\/caderno\//.test(path)) return 'notebook';
    return null;
  })();

  fetch('/assets/data/media.json', { cache: 'no-store' }).then(response => response.ok ? response.json() : null).then(media => {
    if (!media) return;
    if (media.profile?.src) {
      document.querySelectorAll('[data-profile-photo]').forEach(img => {
        img.src = media.profile.src;
        if (media.profile.alt) img.alt = textFor(media.profile.alt);
      });
    }

    const items = galleryKey ? (media.galleries?.[galleryKey] || []).filter(item => item.src) : [];
    const main = document.querySelector('main.content-shell, main.notebook-shell');
    if (!main || !items.length) return;

    const labels = {
      pt: ['Imagem / registro', 'Registros visuais', 'Imagens próprias ligadas a esta área.'],
      en: ['Image / record', 'Visual notes', 'My own images connected to this area.'],
      es: ['Imagen / registro', 'Registros visuales', 'Imágenes propias relacionadas con esta área.']
    }[langCode];
    const section = document.createElement('section');
    section.className = 'media-section';
    section.innerHTML = `<header class="section-heading section-heading--flow"><p class="section-index">${labels[0]}</p><h2>${labels[1]}</h2><p>${labels[2]}</p></header>`;
    const gallery = document.createElement('div');
    gallery.className = 'media-gallery';
    items.forEach(item => {
      const figure = document.createElement('figure');
      figure.className = 'media-figure';
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = textFor(item.alt);
      img.loading = 'lazy';
      img.decoding = 'async';
      figure.append(img);
      const caption = textFor(item.caption);
      if (caption) {
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = caption;
        figure.append(figcaption);
      }
      gallery.append(figure);
    });
    section.append(gallery);
    main.append(section);
  }).catch(() => {});

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
