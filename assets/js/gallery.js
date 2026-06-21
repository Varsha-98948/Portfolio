document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-mailto-form]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const data = new FormData(form);
            const subject = encodeURIComponent(data.get("subject") || "Portfolio inquiry");
            const body = encodeURIComponent(
                `Name: ${data.get("name") || ""}\nEmail: ${data.get("email") || ""}\n\n${data.get("message") || ""}`
            );
            window.location.href = `mailto:varshajairam@example.com?subject=${subject}&body=${body}`;
        });
    });
});
