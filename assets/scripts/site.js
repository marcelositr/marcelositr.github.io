document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const storageKey = 'devnux.language';
  const htmlLang = document.documentElement.lang.toLowerCase();
  const langCode = htmlLang.startsWith('en') ? 'en' : htmlLang.startsWith('es') ? 'es' : 'pt';
  const siteHeader = document.querySelector('.site-header');

  const routes = {
    pt: {
      home: '/pt/',
      about: '/pt/#sobre',
      environment: '/pt/meio-ambiente/',
      technology: '/pt/tecnologia/',
      radio: '/pt/radio/',
      meliponiculture: '/pt/meliponicultura/',
      notebook: '/caderno/',
      identity: '/pt/#identidade',
      contact: '/pt/#contato'
    },
    en: {
      home: '/en/',
      about: '/en/#about',
      environment: '/en/environment/',
      technology: '/en/technology/',
      radio: '/en/radio/',
      meliponiculture: '/en/meliponiculture/',
      notebook: '/caderno/',
      identity: '/en/#identity',
      contact: '/en/#contact'
    },
    es: {
      home: '/es/',
      about: '/es/#sobre',
      environment: '/es/medio-ambiente/',
      technology: '/es/tecnologia/',
      radio: '/es/radio/',
      meliponiculture: '/es/meliponicultura/',
      notebook: '/caderno/',
      identity: '/es/#identidad',
      contact: '/es/#contacto'
    }
  };

  const labels = {
    pt: {
      home: 'Início',
      about: 'Sobre',
      environment: 'Meio ambiente',
      technology: 'Tecnologia',
      radio: 'Radioamadorismo',
      meliponiculture: 'Meliponicultura',
      notebook: 'Caderno',
      identity: 'Identidade',
      contact: 'Contato'
    },
    en: {
      home: 'Home',
      about: 'About',
      environment: 'Environment',
      technology: 'Technology',
      radio: 'Amateur radio',
      meliponiculture: 'Meliponiculture',
      notebook: 'Caderno · PT-BR',
      identity: 'Identity',
      contact: 'Contact'
    },
    es: {
      home: 'Inicio',
      about: 'Sobre mí',
      environment: 'Medio ambiente',
      technology: 'Tecnología',
      radio: 'Radioafición',
      meliponiculture: 'Meliponicultura',
      notebook: 'Caderno · PT-BR',
      identity: 'Identidad',
      contact: 'Contacto'
    }
  };

  const interfaceLabels = {
    pt: { openMenu: 'Abrir menu', closeMenu: 'Fechar menu', restricted: 'Acesso restrito' },
    en: { openMenu: 'Open menu', closeMenu: 'Close menu', restricted: 'Restricted access' },
    es: { openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', restricted: 'Acceso restringido' }
  }[langCode];

  const sectionFromPath = path => {
    if (/^\/caderno(?:\/|$)/.test(path)) return 'notebook';
    if (/\/(meio-ambiente|environment|medio-ambiente)\//.test(path)) return 'environment';
    if (/\/(tecnologia|technology)\//.test(path)) return 'technology';
    if (/\/radio\//.test(path)) return 'radio';
    if (/\/(meliponicultura|meliponiculture)\//.test(path)) return 'meliponiculture';
    if (/^\/(pt|en|es)\/$/.test(path)) return 'home';
    return null;
  };

  const currentSection = sectionFromPath(location.pathname);

  const primaryNav = document.querySelector('.primary-nav');
  if (primaryNav && currentSection) {
    const order = ['home', 'about', 'environment', 'technology', 'radio', 'meliponiculture', 'notebook', 'identity', 'contact'];
    primaryNav.replaceChildren();
    primaryNav.setAttribute('aria-label', langCode === 'en' ? 'Primary navigation' : langCode === 'es' ? 'Navegación principal' : 'Navegação principal');

    order.forEach(key => {
      const link = document.createElement('a');
      link.href = routes[langCode][key];
      link.textContent = labels[langCode][key];
      if (key === currentSection) link.setAttribute('aria-current', 'page');
      if (key === 'notebook' && langCode !== 'pt') link.lang = 'pt-BR';
      primaryNav.append(link);
    });
  }

  const languageNav = document.querySelector('.language-nav');
  if (languageNav && currentSection === 'notebook') {
    languageNav.remove();
  } else if (languageNav && currentSection) {
    const languageNames = { pt: 'PT', en: 'EN', es: 'ES' };
    languageNav.replaceChildren();
    languageNav.setAttribute('aria-label', langCode === 'en' ? 'Language' : 'Idioma');

    ['pt', 'en', 'es'].forEach(language => {
      const link = document.createElement('a');
      link.href = routes[language][currentSection];
      link.dataset.language = language;
      link.textContent = languageNames[language];
      if (language === langCode) link.setAttribute('aria-current', 'page');
      languageNav.append(link);
    });
  }

  if (siteHeader && primaryNav) {
    const headerActions = siteHeader.querySelector('.header-actions');
    primaryNav.id ||= 'primary-navigation';
    siteHeader.classList.add('has-responsive-nav');

    const mobileRestricted = document.createElement('a');
    mobileRestricted.className = 'mobile-restricted-link';
    mobileRestricted.href = '/gateway/';
    mobileRestricted.textContent = interfaceLabels.restricted;
    primaryNav.append(mobileRestricted);

    if (headerActions) {
      const menuButton = document.createElement('button');
      menuButton.type = 'button';
      menuButton.className = 'nav-toggle';
      menuButton.setAttribute('aria-controls', primaryNav.id);
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', interfaceLabels.openMenu);
      menuButton.innerHTML = '<span class="nav-toggle__icon" aria-hidden="true"></span>';
      headerActions.append(menuButton);

      const setMenuState = open => {
        primaryNav.classList.toggle('is-open', open);
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? interfaceLabels.closeMenu : interfaceLabels.openMenu);
        document.documentElement.classList.toggle('nav-open', open);
      };

      menuButton.addEventListener('click', () => {
        setMenuState(menuButton.getAttribute('aria-expanded') !== 'true');
      });

      primaryNav.addEventListener('click', event => {
        if (event.target.closest('a')) setMenuState(false);
      });

      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
          setMenuState(false);
          menuButton.focus();
        }
      });

      document.addEventListener('click', event => {
        if (menuButton.getAttribute('aria-expanded') === 'true' && !siteHeader.contains(event.target)) setMenuState(false);
      });

      const desktopQuery = window.matchMedia('(min-width: 1025px)');
      const closeOnDesktop = event => { if (event.matches) setMenuState(false); };
      desktopQuery.addEventListener?.('change', closeOnDesktop);
    }
  }

  document.querySelectorAll('[data-language]').forEach(link => {
    link.addEventListener('click', () => {
      const language = link.dataset.language;
      if (['pt', 'en', 'es'].includes(language)) localStorage.setItem(storageKey, language);
    });
  });

  const pageTitles = {
    home: {
      pt: 'Marcelo Trindade | DevNux',
      en: 'Marcelo Trindade | DevNux',
      es: 'Marcelo Trindade | DevNux'
    },
    environment: {
      pt: 'Meio ambiente | Marcelo Trindade · DevNux',
      en: 'Environment | Marcelo Trindade · DevNux',
      es: 'Medio ambiente | Marcelo Trindade · DevNux'
    },
    technology: {
      pt: 'Tecnologia | Marcelo Trindade · DevNux',
      en: 'Technology | Marcelo Trindade · DevNux',
      es: 'Tecnología | Marcelo Trindade · DevNux'
    },
    radio: {
      pt: 'Radioamadorismo | Marcelo Trindade · PU2OMT',
      en: 'Amateur radio | Marcelo Trindade · PU2OMT',
      es: 'Radioafición | Marcelo Trindade · PU2OMT'
    },
    meliponiculture: {
      pt: 'Meliponicultura | Marcelo Trindade · DevNux',
      en: 'Meliponiculture | Marcelo Trindade · DevNux',
      es: 'Meliponicultura | Marcelo Trindade · DevNux'
    }
  };

  if (currentSection === 'notebook') {
    const articleTitle = document.querySelector('.notebook-article h1')?.textContent?.trim();
    document.title = articleTitle ? `${articleTitle} | Caderno · DevNux` : 'Caderno | Marcelo Trindade · DevNux';
  } else if (currentSection && pageTitles[currentSection]) {
    document.title = pageTitles[currentSection][langCode];
  }

  const publicFooter = document.querySelector('.site-footer');
  if (publicFooter) {
    const currentYear = new Date().getFullYear();
    const copyrightYears = currentYear > 2025 ? `2025–${currentYear}` : '2025';
    const footerInner = publicFooter.querySelector('.footer-inner');

    if (footerInner) {
      footerInner.innerHTML = `<div class="footer-brand"><strong>DEVNUX</strong><span>Marcelo Trindade</span></div><p class="footer-meta"><a href="/caderno/feed.xml">RSS</a> · <a href="/humans.txt">humans.txt</a> · <a href="/marcelo.vcf">vCard</a> · <a href="/.well-known/security.txt">Security</a><br>© ${copyrightYears} Marcelo Trindade · <a href="https://devnux.com.br">devnux.com.br</a></p>`;
    }
  }

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

  const textFor = value => typeof value === 'string' ? value : (value?.[langCode] || value?.pt || value?.en || '');
  const galleryKey = (() => {
    const path = location.pathname;
    if (/\/(meio-ambiente|environment|medio-ambiente)\//.test(path)) return 'environment';
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

    const galleryLabels = {
      pt: ['Imagem / registro', 'Registros visuais', 'Imagens próprias ligadas a esta área.'],
      en: ['Image / record', 'Visual notes', 'My own images connected to this area.'],
      es: ['Imagen / registro', 'Registros visuales', 'Imágenes propias relacionadas con esta área.']
    }[langCode];
    const section = document.createElement('section');
    section.className = 'media-section';
    section.innerHTML = `<header class="section-heading section-heading--flow"><p class="section-index">${galleryLabels[0]}</p><h2>${galleryLabels[1]}</h2><p>${galleryLabels[2]}</p></header>`;
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

  const updateHeader = () => siteHeader?.classList.toggle('is-scrolled', window.scrollY > 12);
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
