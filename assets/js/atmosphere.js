(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const injectGlobalLayers = () => {
        if (document.querySelector(".atmosphere-root")) return;

        const root = document.createElement("div");
        root.className = "atmosphere-root";
        root.setAttribute("aria-hidden", "true");
        root.innerHTML = `
            <div class="atmosphere-aurora"></div>
            <div class="atmosphere-stars"></div>
            <div class="atmosphere-grain"></div>
            <div class="atmosphere-vignette"></div>
        `;
        document.body.prepend(root);
    };

    const injectPageDecos = () => {
        const body = document.body;
        const page = [...body.classList].find((c) => c.startsWith("page-") || c === "landing-page");
        if (!page) return;

        const targets = {
            "page-home": [
                { section: ".home-bento", html: starSvg(32), class: "deco-float--star", style: "top:15%;right:4%;width:32px;height:32px" },
                { section: ".home-showcase", html: arrowSvg(), class: "deco-float--arrow", style: "top:5%;right:8%;width:48px;height:24px" }
            ],
            "page-about": [
                { section: ".about-education", html: stickyNoteSvg(), class: "deco-float", style: "bottom:10%;left:3%;width:44px;height:44px;opacity:0.1" }
            ],
            "page-projects": [
                { section: ".projects-chapter--building", html: planetSvg(40), class: "deco-float--planet", style: "top:8%;right:5%;width:40px;height:40px" }
            ],
            "page-contact": [
                { section: ".contact-grid", html: starSvg(24), class: "deco-float--star", style: "bottom:5%;right:3%;width:24px;height:24px" }
            ],
            "landing-page": [
                { section: ".landing-cinematic-main", html: starSvg(28), class: "deco-float--star", style: "bottom:25%;right:12%;width:28px;height:28px" }
            ]
        };

        (targets[page] || []).forEach(({ section, html, class: cls, style }) => {
            const el = document.querySelector(section);
            if (!el || el.querySelector(".deco-float")) return;
            const deco = document.createElement("div");
            deco.className = `deco-float ${cls}`;
            deco.setAttribute("aria-hidden", "true");
            deco.style.cssText = style;
            deco.innerHTML = html;
            el.style.position = "relative";
            el.appendChild(deco);
        });
    };

    const starSvg = (size) => `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z" stroke="#f0b86e" stroke-width="0.8" fill="none"/></svg>`;

    const arrowSvg = () => `<svg viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12h32M28 6l8 6-8 6" stroke="#a78bfa" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    const planetSvg = (size) => `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="10" stroke="#4fd1c5" stroke-width="0.8"/><ellipse cx="20" cy="20" rx="16" ry="5" stroke="#4fd1c5" stroke-width="0.6" transform="rotate(-25 20 20)"/></svg>`;

    const stickyNoteSvg = () => `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h32v32l-8-8H6V6z" stroke="#f0b86e" stroke-width="1" fill="rgba(240,184,110,0.05)"/><path d="M12 14h20M12 20h14" stroke="#f0b86e" stroke-width="0.7" opacity="0.6"/></svg>`;

    const initCursorGlow = () => {
        if (prefersReduced || window.matchMedia("(pointer: coarse)").matches) return;

        const glow = document.createElement("div");
        glow.className = "cursor-glow";
        glow.setAttribute("aria-hidden", "true");
        document.body.appendChild(glow);

        let active = false;
        document.addEventListener("mousemove", (e) => {
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
            if (!active) {
                active = true;
                document.body.classList.add("is-cursor-active");
            }
        }, { passive: true });

        document.addEventListener("mouseleave", () => {
            document.body.classList.remove("is-cursor-active");
            active = false;
        });
    };

    const initParallax = () => {
        if (prefersReduced) return;

        const layers = document.querySelectorAll(".atmosphere-aurora, .home-showcase-hero-glow, .contact-deco");
        if (!layers.length) return;

        let ticking = false;
        window.addEventListener("scroll", () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const y = window.scrollY * 0.04;
                layers.forEach((layer, i) => {
                    layer.style.transform = `translateY(${y * (i + 1) * 0.3}px)`;
                });
                ticking = false;
            });
        }, { passive: true });
    };

    document.addEventListener("DOMContentLoaded", () => {
        injectGlobalLayers();
        injectPageDecos();
        initCursorGlow();
        initParallax();
    });
})();
