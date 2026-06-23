document.addEventListener("DOMContentLoaded", () => {
    const scene = document.querySelector(".landing-cinematic");
    if (!scene) return;

    const cards = document.querySelectorAll(".landing-float-card");
    let active = 0;

    if (cards.length) {
        const cycle = () => {
            cards.forEach((card, i) => card.classList.toggle("is-front", i === active));
            active = (active + 1) % cards.length;
        };
        cycle();
        setInterval(cycle, 4000);
    }

    const title = document.querySelector(".landing-cinematic-title");
    if (title) {
        title.querySelectorAll(".landing-word").forEach((word, i) => {
            word.style.animationDelay = `${0.15 + i * 0.12}s`;
        });
    }

    document.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 14;
        scene.style.setProperty("--mx", `${x}px`);
        scene.style.setProperty("--my", `${y}px`);
    });
});
