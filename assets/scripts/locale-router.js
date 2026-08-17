(() => {
  const storageKey = 'devnux.language';
  const supported = new Set(['pt', 'en', 'es']);

  const normalize = value => {
    const language = String(value || '').toLowerCase().split('-')[0];
    return supported.has(language) ? language : null;
  };

  document.querySelectorAll('[data-language]').forEach(link => {
    link.addEventListener('click', () => {
      const language = normalize(link.dataset.language);
      if (language) localStorage.setItem(storageKey, language);
    });
  });

  const saved = normalize(localStorage.getItem(storageKey));
  const detected = (navigator.languages || [navigator.language]).map(normalize).find(Boolean);
  const target = saved || detected || 'pt';
  window.location.replace(`/${target}/`);
})();
