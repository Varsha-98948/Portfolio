(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const chapters = document.querySelectorAll(
        ".about-story-hero, .about-roadmap, .about-achievements, .about-education, .about-philosophy"
    );

    const chapterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-chapter-visible");
                chapterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    chapters.forEach((section) => chapterObserver.observe(section));

    const hero = document.querySelector(".about-story-hero");
    if (hero) {
        requestAnimationFrame(() => {
            const { top, height } = hero.getBoundingClientRect();
            if (top < window.innerHeight * 0.9 && top + height > 0) {
                hero.classList.add("is-chapter-visible");
            }
        });
    }

    const drawables = document.querySelectorAll(".about-sketch--drawable");
    if (drawables.length) {
        if (prefersReduced) {
            drawables.forEach((el) => el.classList.add("is-drawn"));
        } else {
            const drawObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-drawn");
                        drawObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.35, rootMargin: "0px 0px -8% 0px" });

            drawables.forEach((el) => drawObserver.observe(el));
        }
    }

    document.querySelectorAll("[data-about-twinkle]").forEach((el, index) => {
        el.style.animationDelay = `${index * 2.8 + 1}s`;
    });
})();
