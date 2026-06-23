document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector("[data-roadmap-track]");
    if (!track) return;

    const steps = track.querySelectorAll("[data-roadmap-step]");
    let active = 0;

    const setActive = (index) => {
        active = index;
        steps.forEach((step, i) => step.classList.toggle("is-expanded", i === index));
    };

    steps.forEach((step, i) => {
        step.addEventListener("mouseenter", () => setActive(i));
        step.addEventListener("focus", () => setActive(i));
    });

    track.addEventListener("mouseleave", () => setActive(0));
    setActive(0);
});
