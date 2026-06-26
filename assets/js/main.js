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

    initAtmosphere();
});

function initAtmosphere() {
    if (document.querySelector(".atmosphere-root") || document.body.classList.contains("landing-page")) return;

    const root = document.createElement("div");
    root.className = "atmosphere-root";
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = `
        <div class="atmosphere-mesh"></div>
        <div class="atmosphere-aurora"></div>
        <div class="atmosphere-stars"></div>
        <div class="atmosphere-grain"></div>
        <div class="atmosphere-vignette"></div>
    `;
    document.body.prepend(root);
}
