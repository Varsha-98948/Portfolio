(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const EASE = "cubic-bezier(0.37, 0, 0.63, 1)";

    const chapters = document.querySelectorAll(
        ".about-story-hero, .about-roadmap, .about-achievements, .about-education, .about-philosophy"
    );

    const chapterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const section = entry.target;
            section.classList.add("is-chapter-visible");
            unfoldSection(section);
            chapterObserver.unobserve(section);
        });
    }, { threshold: 0.12 });

    chapters.forEach((section) => chapterObserver.observe(section));

    const hero = document.querySelector(".about-story-hero");
    if (hero) {
        requestAnimationFrame(() => {
            const { top, height } = hero.getBoundingClientRect();
            if (top < window.innerHeight * 0.92 && top + height > 0) {
                hero.classList.add("is-chapter-visible");
                unfoldSection(hero);
            }
        });
    }

    function unfoldSection(section) {
        const items = section.querySelectorAll("[data-about-unfold-item]");
        items.forEach((el, index) => {
            const delay = 180 + index * 160;
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-unfolded");
        });
    }

    function prepareStroke(el) {
        const length = el.getTotalLength();
        el.style.strokeDasharray = `${length}`;
        el.style.strokeDashoffset = `${length}`;
        return length;
    }

    function drawStroke(el, duration = 1400, delay = 0) {
        const length = Number(el.dataset.drawLength) || prepareStroke(el);
        el.dataset.drawLength = length;
        el.style.transition = `stroke-dashoffset ${duration}ms ${EASE} ${delay}ms`;
        requestAnimationFrame(() => {
            el.style.strokeDashoffset = "0";
        });
    }

    const drawRoots = document.querySelectorAll(
        ".about-sketch--drawable, .about-word-underline, .about-eyebrow-line, .about-quote-line"
    );

    if (prefersReduced) {
        drawRoots.forEach((root) => {
            root.classList.add("is-drawn");
            root.querySelectorAll(".about-draw-path, path, line, circle, polyline").forEach((el) => {
                prepareStroke(el);
                el.style.strokeDashoffset = "0";
            });
        });
    } else {
        drawRoots.forEach((root) => {
            root.querySelectorAll(".about-draw-path, path, line, circle, polyline").forEach(prepareStroke);
        });

        const drawObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const root = entry.target;
                root.classList.add("is-drawn");

                root.querySelectorAll(".about-draw-path, path, line, circle, polyline").forEach((path, i) => {
                    const duration = root.classList.contains("about-word-underline") ? 1000 : 1300;
                    const delay = root.classList.contains("about-eyebrow-line") ? 280 + i * 100
                        : root.classList.contains("about-quote-line") ? 200 + i * 100
                        : i * 160;
                    drawStroke(path, duration, delay);
                });

                drawObserver.unobserve(root);
            });
        }, { threshold: 0.35, rootMargin: "0px 0px -5% 0px" });

        drawRoots.forEach((el) => drawObserver.observe(el));

        if (hero) {
            requestAnimationFrame(() => {
                const { top, height } = hero.getBoundingClientRect();
                if (top < window.innerHeight && top + height > 0) {
                    hero.querySelectorAll(
                        ".about-sketch--drawable, .about-word-underline, .about-eyebrow-line"
                    ).forEach((root) => {
                        if (root.classList.contains("is-drawn")) return;
                        root.classList.add("is-drawn");
                        root.querySelectorAll(".about-draw-path, path, line, circle, polyline").forEach((path, i) => {
                            const duration = root.classList.contains("about-word-underline") ? 1000 : 1300;
                            drawStroke(path, duration, 400 + i * 140);
                        });
                    });
                }
            });
        }
    }

    document.querySelectorAll("[data-about-twinkle]").forEach((el) => {
        el.style.setProperty("--twinkle-delay", `${4 + Math.random() * 10}s`);
        el.style.setProperty("--twinkle-duration", `${12 + Math.random() * 8}s`);
    });

    if (!prefersReduced && !coarsePointer) {
        const proximityTargets = document.querySelectorAll("[data-about-proximity]");
        let rafId = null;
        let cursor = { x: 0, y: 0 };

        document.addEventListener("mousemove", (e) => {
            cursor = { x: e.clientX, y: e.clientY };
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                proximityTargets.forEach((el) => {
                    if (!el.classList.contains("is-drawn")) return;
                    const rect = el.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dist = Math.hypot(cursor.x - cx, cursor.y - cy);
                    const radius = Number(el.dataset.proximityRadius) || 110;
                    const influence = Math.max(0, 1 - dist / radius);
                    const pull = influence * 0.032;

                    el.style.setProperty("--prox-x", `${((cursor.x - cx) * pull).toFixed(2)}px`);
                    el.style.setProperty("--prox-y", `${((cursor.y - cy) * pull).toFixed(2)}px`);
                    el.style.setProperty("--prox-o", `${0.18 + influence * 0.14}`);
                });
                rafId = null;
            });
        }, { passive: true });
    }

    initChapterEndTransition();
})();

function initChapterEndTransition() {
    const chapterEnd = document.querySelector(".about-chapter-end");
    if (!chapterEnd) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const planeStage = chapterEnd.querySelector("[data-about-plane]");
    const foldPaths = planeStage?.querySelectorAll(".about-plane-fold-lines .about-plane-stroke") || [];
    const bodyPaths = planeStage?.querySelectorAll(".about-plane-body .about-plane-stroke") || [];
    const trailPath = planeStage?.querySelector(".about-plane-trail-path");

    if (prefersReduced) {
        chapterEnd.classList.add("is-chapter-visible", "is-plane-ready", "is-plane-folded", "is-chapter-replayed");
        return;
    }

    if (sessionStorage.getItem("about-chapter-end-played") === "1") {
        chapterEnd.classList.add("is-chapter-visible", "is-plane-ready", "is-plane-folded", "is-chapter-replayed");
        [...foldPaths, ...bodyPaths].forEach((el) => {
            el.style.strokeDashoffset = "0";
        });
        return;
    }

    const prepare = (el) => {
        const length = el.getTotalLength();
        el.style.strokeDasharray = `${length}`;
        el.style.strokeDashoffset = `${length}`;
        return length;
    };

    [...foldPaths, ...bodyPaths].forEach(prepare);
    if (trailPath) prepare(trailPath);

    const EASE = "cubic-bezier(0.37, 0, 0.63, 1)";

    const draw = (el, duration, delay) => {
        const length = el.getTotalLength();
        el.style.transition = `stroke-dashoffset ${duration}ms ${EASE} ${delay}ms`;
        requestAnimationFrame(() => {
            el.style.strokeDashoffset = "0";
        });
    };

    let played = false;

    const runSequence = () => {
        if (played) return;
        played = true;
        sessionStorage.setItem("about-chapter-end-played", "1");

        chapterEnd.classList.add("is-chapter-visible");

        window.setTimeout(() => {
            chapterEnd.classList.add("is-plane-ready");
            foldPaths.forEach((path, i) => draw(path, 420, i * 80));
        }, 700);

        window.setTimeout(() => {
            chapterEnd.classList.add("is-plane-folded");
            bodyPaths.forEach((path, i) => draw(path, 380, i * 70));
        }, 1100);

        window.setTimeout(() => {
            chapterEnd.classList.add("is-plane-flying");
        }, 1450);
    };

    const endObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.28) {
                runSequence();
                endObserver.disconnect();
            }
        });
    }, { threshold: [0, 0.28, 0.45] });

    endObserver.observe(chapterEnd);
}
document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.getElementById("imgLightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeBtn = document.getElementById("lightboxClose");

    // open on click
    document.querySelectorAll(".achievement-image img").forEach(img => {
        img.addEventListener("click", () => {
            lightboxImg.src = img.src;
            lightbox.classList.add("active");
        });
    });

    // close actions
    const closeLightbox = () => {
        lightbox.classList.remove("active");
        lightboxImg.src = "";
    };

    closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
    });
});
