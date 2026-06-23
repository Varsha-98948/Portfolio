document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-filter-section]").forEach((section) => {
        const filterBar = section.querySelector("[data-filter-bar]");
        const buttons = section.querySelectorAll("[data-section-filter]");
        const cards = section.querySelectorAll("[data-project-card]");

        if (!filterBar || !buttons.length) return;

        const indicator = document.createElement("span");
        indicator.className = "glass-tab-indicator";
        filterBar.appendChild(indicator);

        const moveIndicator = (btn) => {
            if (!btn || window.innerWidth < 768) {
                indicator.style.opacity = "0";
                return;
            }
            const barRect = filterBar.getBoundingClientRect();
            const btnRect = btn.getBoundingClientRect();
            indicator.style.left = `${btnRect.left - barRect.left}px`;
            indicator.style.width = `${btnRect.width}px`;
            indicator.style.opacity = "1";
        };

        const applyFilter = (button) => {
            const filter = button.dataset.sectionFilter;
            buttons.forEach((item) => item.classList.toggle("is-active", item === button));
            cards.forEach((card) => {
                const values = (card.dataset.tech || "").split(" ");
                card.classList.toggle("is-hidden", filter !== "all" && !values.includes(filter));
            });
            moveIndicator(button);
        };

        const active = section.querySelector("[data-section-filter].is-active") || buttons[0];
        requestAnimationFrame(() => moveIndicator(active));

        buttons.forEach((button) => {
            button.addEventListener("click", () => applyFilter(button));
            button.addEventListener("mouseenter", () => moveIndicator(button));
        });

        filterBar.addEventListener("mouseleave", () => moveIndicator(section.querySelector("[data-section-filter].is-active")));
        window.addEventListener("resize", () => moveIndicator(section.querySelector("[data-section-filter].is-active")));
    });
});
