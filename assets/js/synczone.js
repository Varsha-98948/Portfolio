document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const tourItems = document.querySelectorAll(".tour-item");
    const slides = document.querySelectorAll(".tour-slide");
    const tourContainer = document.querySelector(".synczone-tour");

    if (!tourItems.length || !slides.length) return;

    let currentIndex = 0;
    let autoplayInterval = null;
    let isHovered = false;

    // =====================================================
    // SET ACTIVE SLIDE
    // =====================================================

    function setActiveSlide(index) {

        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        currentIndex = index;

        // Reset all
        tourItems.forEach(item => item.classList.remove("active"));
        slides.forEach(slide => slide.classList.remove("active"));

        // Activate current
        tourItems[index].classList.add("active");
        slides[index].classList.add("active");

        // Scroll active nav into view (mobile UX improvement)
        tourItems[index].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
        });
    }

    // =====================================================
    // CLICK NAVIGATION
    // =====================================================

    tourItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            setActiveSlide(index);
        });
    });

    // =====================================================
    // KEYBOARD NAVIGATION
    // =====================================================

    document.addEventListener("keydown", (e) => {

        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            setActiveSlide(currentIndex + 1);
        }

        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            setActiveSlide(currentIndex - 1);
        }

    });

    // =====================================================
    // AUTO PLAY (OPTIONAL BUT PREMIUM FEEL)
    // =====================================================

    function startAutoplay() {

        autoplayInterval = setInterval(() => {

            if (!isHovered) {
                setActiveSlide(currentIndex + 1);
            }

        }, 7000); // slow premium pacing

    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    startAutoplay();

    // =====================================================
    // PAUSE ON HOVER (IMPORTANT UX DETAIL)
    // =====================================================

    if (tourContainer) {

        tourContainer.addEventListener("mouseenter", () => {
            isHovered = true;
        });

        tourContainer.addEventListener("mouseleave", () => {
            isHovered = false;
        });

    }

    // =====================================================
    // INITIAL STATE
    // =====================================================

    setActiveSlide(0);

});