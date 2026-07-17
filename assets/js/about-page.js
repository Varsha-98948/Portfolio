(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const EASE = "cubic-bezier(0.37, 0, 0.63, 1)";

    // ─── Page Intro Animation ───
    // ─── Chapter Reveal System ───
    const chapters = document.querySelectorAll(
        ".about-story-hero, .about-achievements, .about-education, .about-philosophy"
    );

    const chapterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const section = entry.target;
            section.classList.add("is-chapter-visible");
            unfoldSection(section);
            chapterObserver.unobserve(section);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

    chapters.forEach((section) => chapterObserver.observe(section));

    // Hero immediate reveal if already in viewport
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

    // ─── SVG Stroke Draw Animation ───
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

        // Immediate hero draw
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

    // ─── Star Twinkle Randomization ───
    document.querySelectorAll("[data-about-twinkle]").forEach((el) => {
        el.style.setProperty("--twinkle-delay", `${4 + Math.random() * 10}s`);
        el.style.setProperty("--twinkle-duration", `${12 + Math.random() * 8}s`);
    });

    // ─── Magnetic Buttons ───
    function initMagneticButtons() {
        if (coarsePointer || prefersReduced) return;

        document.querySelectorAll('.magnetic-btn').forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = 60;

                if (distance < maxDistance) {
                    const strength = 0.3;
                    btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
                }
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ─── Mouse Parallax for Doodles ───
    function initMouseParallax() {
        if (coarsePointer || prefersReduced) return;

        let rafId = null;
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function updateParallax() {
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;

            document.querySelectorAll('.about-sketch[data-about-proximity]').forEach((sketch) => {
                const radius = parseInt(sketch.dataset.proximityRadius) || 100;
                const x = currentX * radius * 0.15;
                const y = currentY * radius * 0.15;
                sketch.style.setProperty('--prox-x', `${x}px`);
                sketch.style.setProperty('--prox-y', `${y}px`);
            });

            rafId = requestAnimationFrame(updateParallax);
        }

        updateParallax();
    }

    // ─── Ambient Particle Mouse Interaction ───
    // ─── Lightbox ───
    function initLightbox() {
        const lightbox = document.getElementById("imgLightbox");
        const lightboxImg = document.getElementById("lightboxImg");
        const closeBtn = document.getElementById("lightboxClose");

        if (!lightbox || !lightboxImg || !closeBtn) return;

        // Open on click
        document.querySelectorAll(".achievement-image img").forEach((img) => {
            img.style.cursor = 'pointer';
            img.addEventListener("click", () => {
                lightboxImg.src = img.src;
                lightbox.classList.add("active");
                document.body.style.overflow = 'hidden';
            });
        });

        // Close actions
        const closeLightbox = () => {
            lightbox.classList.remove("active");
            lightboxImg.src = "";
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeLightbox();
        });
    }

    // ─── Smooth Scroll for Internal Links ───
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ─── Education Card Stagger Animation ───
    function initEducationCards() {
        const cards = document.querySelectorAll('.education-card-v2');
        if (!cards.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-unfolded');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        cards.forEach((card) => observer.observe(card));
    }

    // ─── Initialize Everything ───
    initMagneticButtons();
    initMouseParallax();
    initLightbox();
    initSmoothScroll();
    initEducationCards();
})();
