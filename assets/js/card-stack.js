(() => {
    const section = document.querySelector('[data-card-stack-section]');
    if (!section) return;

    const stage = section.querySelector('[data-card-stack-stage]');
    const viewport = section.querySelector('[data-card-stack-viewport]');
    const cards = Array.from(section.querySelectorAll('[data-card-stack-card]'));
    const prevBtn = section.querySelector('[data-card-stack-prev]');
    const nextBtn = section.querySelector('[data-card-stack-next]');
    const toggleBtn = section.querySelector('[data-card-stack-toggle]');
    const counter = section.querySelector('[data-card-stack-counter]');

    if (!stage || !viewport || !cards.length) return;

    const projects = cards.map((card) => ({
        element: card,
        index: cards.indexOf(card),
        media: card.querySelector('.card-stack-media')
    }));

    let activeIndex = 0;
    let autoplayTimer = null;
    let autoplayEnabled = true;

    const setActiveCard = (index, { animate = true } = {}) => {
        activeIndex = (index + projects.length) % projects.length;

        projects.forEach((project, projectIndex) => {
            const offset = (projectIndex - activeIndex + projects.length) % projects.length;
            const classes = project.element.classList;
            classes.remove('is-active', 'is-side', 'is-prev', 'is-next', 'is-far-prev', 'is-far-next', 'is-hidden');

            if (offset === 0) {
                classes.add('is-active');
            } else if (offset === 1) {
                classes.add('is-next');
            } else if (offset === projects.length - 1) {
                classes.add('is-prev');
            } else if (offset === 2) {
                classes.add('is-far-next');
            } else if (offset === projects.length - 2) {
                classes.add('is-far-prev');
            } else {
                classes.add('is-hidden');
            }

            if (offset !== 0) {
                classes.add('is-side');
            }
        });

        if (counter) {
            counter.textContent = `${activeIndex + 1} / ${projects.length}`;
        }

        projects.forEach((project) => {
            if (project.media) {
                project.media.style.setProperty('--card-stack-accent', project.element.dataset.cardStackAccent || 'linear-gradient(140deg, rgba(110,231,214,0.24), rgba(124,132,168,0.18))');
            }
        });

        if (animate) {
            viewport.style.transition = 'transform 700ms cubic-bezier(0.2, 0.88, 0.24, 1)';
        }
    };

    const goTo = (direction) => {
        setActiveCard(activeIndex + direction);
        restartAutoplay();
    };

    const restartAutoplay = () => {
        if (!autoplayEnabled) return;
        clearInterval(autoplayTimer);
        autoplayTimer = window.setInterval(() => {
            goTo(1);
        }, 4500);
    };

    const toggleAutoplay = () => {
        autoplayEnabled = !autoplayEnabled;
        if (toggleBtn) {
            toggleBtn.textContent = autoplayEnabled ? 'Autoplay: On' : 'Autoplay: Off';
        }
        if (autoplayEnabled) {
            restartAutoplay();
        } else {
            clearInterval(autoplayTimer);
        }
    };

    projects.forEach((project) => {
        project.element.addEventListener('click', () => {
            setActiveCard(project.index);
            restartAutoplay();
        });
    });

    prevBtn?.addEventListener('click', () => goTo(-1));
    nextBtn?.addEventListener('click', () => goTo(1));
    toggleBtn?.addEventListener('click', toggleAutoplay);

    stage.addEventListener('mouseenter', () => {
        if (autoplayEnabled) {
            clearInterval(autoplayTimer);
        }
    });

    stage.addEventListener('mouseleave', () => {
        if (autoplayEnabled) {
            restartAutoplay();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goTo(-1);
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            goTo(1);
        }
    });

    setActiveCard(0, { animate: false });
    restartAutoplay();
})();
