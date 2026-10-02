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

  if (!nav || !actions) return;

  nav.id = "primary-navigation";

  let button = null;

  const closeMenu = () => {
    nav.classList.remove("is-open");
    if (button) {
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Abrir menu");
    }
  };

  const ensureMobileNavigation = () => {
    const mobile = window.matchMedia("(max-width: 1024px)").matches;

    if (mobile && !button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "nav-toggle";
      button.setAttribute("aria-controls", "primary-navigation");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Abrir menu");
      button.innerHTML = '<span class="nav-toggle__icon" aria-hidden="true"></span>';
      actions.append(button);

      button.addEventListener("click", () => {
        const open = button.getAttribute("aria-expanded") !== "true";
        nav.classList.toggle("is-open", open);
        button.setAttribute("aria-expanded", String(open));
        button.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      });
    }

    if (!mobile && button) {
      closeMenu();
      button.remove();
      button = null;
    }
  };

  nav.addEventListener("click", event => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  ensureMobileNavigation();
  window.addEventListener("resize", ensureMobileNavigation);
});