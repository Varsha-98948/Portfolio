document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector("[data-achievements-carousel]");
    if (!carousel) return;

    const viewport = carousel.querySelector("[data-achievements-viewport]");
    const track = carousel.querySelector("[data-achievements-track]");
    const cards = carousel.querySelectorAll(".achievement-card");
    const prevBtn = carousel.querySelector("[data-achievements-prev]");
    const nextBtn = carousel.querySelector("[data-achievements-next]");
    const dotsWrap = carousel.querySelector("[data-achievements-dots]");

    if (!track || !cards.length) return;

    const getVisible = () => (window.innerWidth >= 992 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    const getMaxIndex = () => Math.max(0, cards.length - getVisible());

    let current = 0;

    const update = () => {
        const visible = getVisible();
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(track).gap) || 16;
        track.style.transform = `translateX(-${current * (cardWidth + gap)}px)`;

        if (dotsWrap) {
            dotsWrap.querySelectorAll(".achievement-dot").forEach((dot, i) => {
                dot.classList.toggle("is-active", i === current);
            });
        }

        prevBtn?.toggleAttribute("disabled", current === 0);
        nextBtn?.toggleAttribute("disabled", current >= getMaxIndex());
    };

    if (dotsWrap) {
        for (let i = 0; i <= getMaxIndex(); i++) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "achievement-dot" + (i === 0 ? " is-active" : "");
            dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
            dot.addEventListener("click", () => { current = i; update(); });
            dotsWrap.appendChild(dot);
        }
    }

    prevBtn?.addEventListener("click", () => { current = Math.max(0, current - 1); update(); });
    nextBtn?.addEventListener("click", () => { current = Math.min(getMaxIndex(), current + 1); update(); });

    let touchStartX = 0;
    viewport?.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    viewport?.addEventListener("touchend", (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) {
            current = diff > 0 ? Math.min(getMaxIndex(), current + 1) : Math.max(0, current - 1);
            update();
        }
    }, { passive: true });

    window.addEventListener("resize", () => {
        current = Math.min(current, getMaxIndex());
        if (dotsWrap) {
            dotsWrap.innerHTML = "";
            for (let i = 0; i <= getMaxIndex(); i++) {
                const dot = document.createElement("button");
                dot.type = "button";
                dot.className = "achievement-dot" + (i === current ? " is-active" : "");
                dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
                dot.addEventListener("click", () => { current = i; update(); });
                dotsWrap.appendChild(dot);
            }
        }
        update();
    });

    update();
});
