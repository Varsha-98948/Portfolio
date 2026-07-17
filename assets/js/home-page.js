(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const EASE = "cubic-bezier(0.37, 0, 0.63, 1)";

    // ─── Page Intro Animation ───
    // ─── Section Reveal System ───
    const sections = document.querySelectorAll(
        ".home-showcase-hero, .home-stats-strip, .home-showcase, .home-tech, .home-mini-timeline, .home-bento"
    );

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const section = entry.target;
            section.classList.add("is-section-visible");
            unfoldSection(section);
            sectionObserver.unobserve(section);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

    sections.forEach((section) => sectionObserver.observe(section));

    // Hero immediate reveal
    const hero = document.querySelector(".home-showcase-hero");
    if (hero) {
        requestAnimationFrame(() => {
            const { top, height } = hero.getBoundingClientRect();
            if (top < window.innerHeight * 0.92 && top + height > 0) {
                hero.classList.add("is-section-visible");
                unfoldSection(hero);
            }
        });
    }

    function unfoldSection(section) {
        // Unfold text items
        const items = section.querySelectorAll("[data-home-unfold]");
        items.forEach((el, index) => {
            const delay = 180 + index * 140;
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-unfolded");
        });

        // Unfold product chips
        const chips = section.querySelectorAll("[data-home-chip]");
        chips.forEach((el) => {
            const delay = 300 + (parseInt(el.style.getPropertyValue('--chip-i')) || 0) * 120;
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-unfolded");
        });

        // Unfold stat blocks
        const stats = section.querySelectorAll("[data-home-stat]");
        stats.forEach((el) => {
            const delay = 200 + (parseInt(el.style.getPropertyValue('--stat-i')) || 0) * 100;
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-unfolded");
        });

        // Unfold timeline nodes
        const nodes = section.querySelectorAll("[data-home-timeline]");
        nodes.forEach((el) => {
            const delay = 200 + (parseInt(el.style.getPropertyValue('--node-i')) || 0) * 120;
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-unfolded");
        });

        // Draw timeline lines
        const lines = section.querySelectorAll("[data-home-line]");
        lines.forEach((el, index) => {
            const delay = 400 + index * 120 + 200;
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-drawn");
        });

        // Unfold bento cells
        const bentos = section.querySelectorAll("[data-home-bento]");
        bentos.forEach((el) => {
            const delay = 200 + (parseInt(el.style.getPropertyValue('--bento-i')) || 0) * 120;
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

    const drawRoots = document.querySelectorAll(".home-sketch--drawable");

    if (prefersReduced) {
        drawRoots.forEach((root) => {
            root.classList.add("is-drawn");
            root.querySelectorAll("path, line, circle, polyline").forEach((el) => {
                prepareStroke(el);
                el.style.strokeDashoffset = "0";
            });
        });
    } else {
        drawRoots.forEach((root) => {
            root.querySelectorAll("path, line, circle, polyline").forEach(prepareStroke);
        });

        const drawObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const root = entry.target;
                root.classList.add("is-drawn");

                root.querySelectorAll("path, line, circle, polyline").forEach((path, i) => {
                    drawStroke(path, 1300, i * 160);
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
                    hero.querySelectorAll(".home-sketch--drawable").forEach((root) => {
                        if (root.classList.contains("is-drawn")) return;
                        root.classList.add("is-drawn");
                        root.querySelectorAll("path, line, circle, polyline").forEach((path, i) => {
                            drawStroke(path, 1300, 400 + i * 140);
                        });
                    });
                }
            });
        }
    }

    // ─── Star Twinkle Randomization ───
    document.querySelectorAll("[data-home-twinkle]").forEach((el) => {
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

            document.querySelectorAll('.home-sketch[data-home-proximity]').forEach((sketch) => {
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
    // ─── Tech Cloud Enhanced ───
    function initTechCloud() {
        const cloud = document.querySelector("[data-tech-cloud]");
        if (!cloud) return;

        cloud.querySelectorAll(".tech-cloud-tag").forEach((tag) => {
            tag.addEventListener("mouseenter", () => {
                cloud.querySelectorAll(".tech-cloud-tag").forEach((t) => t.classList.toggle("is-dimmed", t !== tag));
                tag.classList.add("is-highlight");
            });
            tag.addEventListener("mouseleave", () => {
                cloud.querySelectorAll(".tech-cloud-tag").forEach((t) => {
                    t.classList.remove("is-dimmed", "is-highlight");
                });
            });
        });
    }

    // ─── Showcase Tabs Sync ───
    function initShowcase() {
        const showcase = document.querySelector("[data-showcase]");
        if (!showcase) return;

        const tabs = showcase.querySelectorAll("[data-showcase-tab]");
        const panels = showcase.querySelectorAll("[data-showcase-panel]");

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const target = tab.dataset.showcaseTab;
                panels.forEach((panel) => {
                    const isActive = panel.dataset.showcasePanel === target;
                    panel.classList.toggle("is-active", isActive);
                });
            });
        });
    }

    // ─── Counter Animation ───
    function initCounters() {
        const counters = document.querySelectorAll("[data-count]");
        if (!counters.length) return;

        const animate = (el) => {
            const target = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || "";
            const prefix = el.dataset.prefix || "";
            const decimals = (String(target).split(".")[1] || "").length;
            const duration = 1400;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = target * eased;
                el.textContent = `${prefix}${decimals ? value.toFixed(decimals) : Math.round(value)}${suffix}`;
                if (progress < 1) requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach((el) => observer.observe(el));
    }

    // ─── Smooth Scroll ───
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

    // ─── Initialize Everything ───
    initMagneticButtons();
    initMouseParallax();
    initTechCloud();
    initShowcase();
    initCounters();
    initSmoothScroll();
})();
