const menuIcon = document.querySelector('.menu-icon');
const navLinks = document.querySelector('.nav-links');
const mobileNav = document.querySelector('.mobile-nav');

menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileNav.classList.toggle('active');
});

document.addEventListener('click', (event) => {
    const target = event.target;
    const isMenuIcon = target.closest('.menu-icon');
    const isNavLinks = target.closest('.nav-links');

    if (!isMenuIcon && !isNavLinks) {
        navLinks.classList.remove('active');
        mobileNav.classList.remove('active');
    }
});

const links = document.querySelectorAll('.nav-links a');

links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileNav.classList.remove('active');
    });
});

const anoCorrente = new Date().getFullYear();
document.getElementById("ano-corrente").textContent = anoCorrente;
