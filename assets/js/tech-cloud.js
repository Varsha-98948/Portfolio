document.addEventListener("DOMContentLoaded", () => {
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
});
