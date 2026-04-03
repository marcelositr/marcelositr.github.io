// Fade-in sections ao scroll
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        obs.unobserve(entry.target); // anima só 1 vez
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(sec => observer.observe(sec));
});