document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('devnux.language');
  const browser = (navigator.language || 'pt').toLowerCase();
  const lang = ['pt', 'en', 'es'].includes(saved) ? saved : browser.startsWith('en') ? 'en' : browser.startsWith('es') ? 'es' : 'pt';
  const copy = {
    pt: { html: 'pt-BR', title: 'Caminho não encontrado.', before: 'Esse endereço não existe por aqui. Volte para ', after: ' ou confira o caminho digitado.', restricted: 'Acesso restrito' },
    en: { html: 'en', title: 'Path not found.', before: 'This address does not exist here. Return to ', after: ' or check the path you entered.', restricted: 'Restricted access' },
    es: { html: 'es', title: 'Ruta no encontrada.', before: 'Esta dirección no existe aquí. Vuelve a ', after: ' o revisa la ruta que escribiste.', restricted: 'Acceso restringido' }
  }[lang];
  document.documentElement.lang = copy.html;
  const title = document.querySelector('[data-404-title]');
  const paragraph = document.querySelector('[data-404-copy]');
  const restricted = document.querySelector('[data-404-restricted]');
  if (title) title.textContent = copy.title;
  if (paragraph) {
    paragraph.textContent = copy.before;
    const link = document.createElement('a');
    link.href = '/';
    link.textContent = 'devnux.com.br';
    paragraph.append(link, document.createTextNode(copy.after));
  }
  if (restricted) restricted.textContent = copy.restricted;
});
