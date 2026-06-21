document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-filter-section]").forEach((section) => {
        const buttons = section.querySelectorAll("[data-section-filter]");
        const cards = section.querySelectorAll("[data-project-card]");

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const filter = button.dataset.sectionFilter;

                buttons.forEach((item) => item.classList.remove("is-active"));
                button.classList.add("is-active");

                cards.forEach((card) => {
                    const values = (card.dataset.tech || "").split(" ");
                    card.classList.toggle("is-hidden", filter !== "all" && !values.includes(filter));
                });
            });
        });
    });
});
