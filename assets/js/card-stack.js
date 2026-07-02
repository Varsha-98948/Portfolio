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

    const projects = cards.map((card, index) => ({
        element: card,
        index,
        media: card.querySelector('.card-stack-media')
    }));

    let activePosition = 0;
    let activeProjectId = 0;
    let autoplayTimer = null;
    let autoplayEnabled = true;

    const getVisibleProjects = () => projects.filter(({ element }) => !element.classList.contains('is-hidden'));

    const updateAccent = () => {
        projects.forEach((project) => {
            if (project.media) {
                const accent = project.element.dataset.cardStackAccent || 'linear-gradient(140deg, rgba(110,231,214,0.24), rgba(124,132,168,0.18))';
                project.media.style.setProperty('--card-stack-accent', accent);
            }
        });
    };

    const setActiveCard = (position, { animate = true } = {}) => {
        const visibleProjects = getVisibleProjects();

        // Clear position classes from all projects first
        projects.forEach((p) => {
            p.element.classList.remove('is-active', 'is-side', 'is-prev', 'is-next', 'is-far-prev', 'is-far-next', 'is-hidden');
        });

        if (!visibleProjects.length) {
            if (counter) counter.textContent = `0 / ${projects.length}`;
            return;
        }

        // If only a single visible project, center it and hide others
        if (visibleProjects.length === 1) {
            const single = visibleProjects[0];
            single.element.classList.add('is-active');
            projects.forEach((proj) => {
                if (proj !== single) proj.element.classList.add('is-hidden');
            });
            activePosition = 0;
            activeProjectId = single.index;
            if (counter) counter.textContent = `1 / 1`;
            updateAccent();
            viewport.style.transition = animate ? 'transform 700ms cubic-bezier(0.2, 0.88, 0.24, 1)' : 'none';
            return;
        }

        // Multiple visible projects: compute resolved position and apply fan layout
        const resolvedPosition = typeof position === 'number'
            ? ((position % visibleProjects.length) + visibleProjects.length) % visibleProjects.length
            : 0;

        activePosition = resolvedPosition;
        activeProjectId = visibleProjects[activePosition].index;

        visibleProjects.forEach((project, projectIndex) => {
            const offset = (projectIndex - activePosition + visibleProjects.length) % visibleProjects.length;
            const classes = project.element.classList;

            if (offset === 0) {
                classes.add('is-active');
            } else if (offset === 1) {
                classes.add('is-next');
            } else if (offset === visibleProjects.length - 1) {
                classes.add('is-prev');
            } else if (offset === 2) {
                classes.add('is-far-next');
            } else if (offset === visibleProjects.length - 2) {
                classes.add('is-far-prev');
            } else {
                classes.add('is-hidden');
            }

            if (offset !== 0) classes.add('is-side');
        });

        if (counter) counter.textContent = `${activePosition + 1} / ${visibleProjects.length}`;
        updateAccent();
        viewport.style.transition = animate ? 'transform 700ms cubic-bezier(0.2, 0.88, 0.24, 1)' : 'none';
    };

    const goTo = (direction) => {
        setActiveCard(activePosition + direction);
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
            if (project.element.classList.contains('is-active')) {
                const href = project.element.dataset.href;
                if (href) {
                    window.location.href = href;
                }
                return;
            }

            const visibleProjects = getVisibleProjects();
            const position = visibleProjects.findIndex((item) => item.element === project.element);
            if (position >= 0) {
                setActiveCard(position);
                restartAutoplay();
            }
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

    section.addEventListener('card-stack:filter', () => {
        setActiveCard(activePosition, { animate: false });
    });

    setActiveCard(0, { animate: false });
    restartAutoplay();
})();
