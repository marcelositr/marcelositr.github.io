document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".primary-nav");
  const actions = document.querySelector(".header-actions");

  if (header) {
    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  if (nav && actions && window.matchMedia("(max-width: 1024px)").matches) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nav-toggle";
    button.setAttribute("aria-controls", "primary-navigation");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Abrir menu");
    button.innerHTML = '<span class="nav-toggle__icon" aria-hidden="true"></span>';
    nav.id = "primary-navigation";
    actions.append(button);

    const setMenu = open => {
      nav.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    };

    button.addEventListener("click", () => setMenu(button.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", event => {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") setMenu(false);
    });
  }
});