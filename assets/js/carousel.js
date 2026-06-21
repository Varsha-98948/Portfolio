document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
        const target = document.querySelector(carousel.dataset.carousel);
        if (!target) return;

        carousel.querySelectorAll("[data-direction]").forEach((button) => {
            button.addEventListener("click", () => {
                const direction = button.dataset.direction === "next" ? 1 : -1;
                target.scrollBy({
                    left: direction * Math.min(target.clientWidth * 0.86, 420),
                    behavior: "smooth"
                });
            });
        });
    });
});
