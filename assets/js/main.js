document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".navbar-custom");
    const updateNavFrost = () => {
        nav?.classList.toggle("is-scrolled", window.scrollY > 18);
    };

    updateNavFrost();
    window.addEventListener("scroll", updateNavFrost, { passive: true });

    document.querySelectorAll(".reveal").forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index * 55, 220)}ms`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

    const year = document.querySelector("[data-current-year]");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

});
