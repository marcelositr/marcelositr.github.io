document.addEventListener("DOMContentLoaded", () => {
  const sections = Array.from(document.querySelectorAll("section"));

  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  sections.forEach(section => section.classList.add("reveal-ready"));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const index = sections.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add("visible"), index * 120);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  sections.forEach(section => observer.observe(section));
});
