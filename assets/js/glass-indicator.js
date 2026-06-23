/** Reusable glass sliding indicator (navbar + tab bars) */
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-glass-tabs]").forEach((tabList) => {
        const indicator = document.createElement("span");
        indicator.className = "glass-tab-indicator";
        tabList.appendChild(indicator);

        const tabs = tabList.querySelectorAll("[data-glass-tab]");
        if (!tabs.length) return;

        const move = (tab) => {
            if (!tab || window.innerWidth < 768) {
                indicator.style.opacity = "0";
                return;
            }
            const listRect = tabList.getBoundingClientRect();
            const tabRect = tab.getBoundingClientRect();
            indicator.style.left = `${tabRect.left - listRect.left}px`;
            indicator.style.width = `${tabRect.width}px`;
            indicator.style.opacity = "1";
        };

        const active = tabList.querySelector("[data-glass-tab].is-active") || tabs[0];
        requestAnimationFrame(() => move(active));

        tabs.forEach((tab) => {
            tab.addEventListener("mouseenter", () => move(tab));
            tab.addEventListener("focus", () => move(tab));
            tab.addEventListener("click", () => {
                tabs.forEach((t) => {
                    t.classList.toggle("is-active", t === tab);
                    t.setAttribute("aria-selected", t === tab ? "true" : "false");
                });
                move(tab);
            });
        });

        tabList.addEventListener("mouseleave", () => move(tabList.querySelector("[data-glass-tab].is-active")));
        window.addEventListener("resize", () => move(tabList.querySelector("[data-glass-tab].is-active")));
    });
});
