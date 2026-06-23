document.addEventListener("DOMContentLoaded", () => {
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
});
