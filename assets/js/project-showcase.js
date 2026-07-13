/* ==========================================================================
   REUSABLE PROJECT SHOWCASE COMPONENT JAVASCRIPT
   ========================================================================== */

class ProjectShowcase {
    constructor(elementId, config, options = {}) {
        this.container = document.getElementById(elementId);
        if (!this.container) return;

        this.items = config;
        this.type = options.type || 'phone'; // 'phone' | 'browser' | 'dashboard'
        this.autoplayDuration = options.autoplayDuration || 6000;
        this.currentUrlDomain = options.domain || 'project.io';

        // State variables
        this.currentIndex = 0;
        this.subIndex = 0; // For dashboard sub-screens
        this.autoplayInterval = null;
        this.isHovered = false;
        
        // Timer tracking variables for smooth resume-on-hover
        this.timerRemaining = this.autoplayDuration;
        this.timerStartTime = null;
        this.progressAnimationId = null;

        this.init();
    }

    init() {
        // Create base HTML skeleton based on type
        if (this.type === 'phone') {
            this.renderPhoneLayout();
        } else if (this.type === 'browser') {
            this.renderBrowserLayout();
        } else if (this.type === 'dashboard') {
            this.renderDashboardLayout();
        }

        // Cache elements
        this.cacheElements();

        // Bind events
        this.bindEvents();

        // Show initial slide
        this.showSlide(0, 0, { resetTimer: true });
    }

    cacheElements() {
        this.glowElement = this.container.querySelector('.showcase-glow');
        this.progressBar = this.container.querySelector('.showcase-progress-bar');
        
        // Layout-specific caches
        if (this.type === 'phone') {
            this.screenImg = this.container.querySelector('.showcase-screen-img');
            this.navItems = Array.from(this.container.querySelectorAll('.showcase-nav-item'));
            this.currentNum = this.container.querySelector('.showcase-counter .current');
            this.subtitleText = this.container.querySelector('.showcase-subtitle');
            this.titleText = this.container.querySelector('.showcase-title-text');
            this.descriptionText = this.container.querySelector('.showcase-desc');
        } else if (this.type === 'browser') {
            this.screensStrip = this.container.querySelector('.browser-screens-strip');
            this.navItems = Array.from(this.container.querySelectorAll('.timeline-nav-item'));
            this.currentNum = this.container.querySelector('.showcase-counter .current');
            this.subtitleText = this.container.querySelector('.showcase-subtitle');
            this.titleText = this.container.querySelector('.showcase-title-text');
            this.descriptionText = this.container.querySelector('.showcase-desc');
            this.addressUrl = this.container.querySelector('.browser-url');
        } else if (this.type === 'dashboard') {
            this.bentoCards = Array.from(this.container.querySelectorAll('.bento-card-nav'));
            this.monitorScreen = this.container.querySelector('.monitor-screen');
            this.subtitleText = this.container.querySelector('.showcase-subtitle');
            this.titleText = this.container.querySelector('.showcase-title-text');
            this.descriptionText = this.container.querySelector('.showcase-desc');
            this.dotsContainer = this.container.querySelector('.monitor-dots-container');
            this.prevBtn = this.container.querySelector('.prev-btn');
            this.nextBtn = this.container.querySelector('.next-btn');
        }
    }

    /* ==========================================================================
       RENDER METHODS
       ========================================================================== */

    renderPhoneLayout() {
        let sidebarHTML = '';
        this.items.forEach((item, idx) => {
            const padNum = String(idx + 1).padStart(2, '0');
            sidebarHTML += `
                <button class="showcase-nav-item" data-index="${idx}" aria-label="View screen ${padNum}: ${item.title}">
                    <span class="showcase-nav-num">${padNum}</span>
                    <div class="showcase-nav-info">
                        <h4>${item.title}</h4>
                        <p>${item.subtitle}</p>
                    </div>
                    <div class="showcase-nav-progress"></div>
                </button>
            `;
        });

        this.container.className = 'showcase-container showcase-phone-container';
        this.container.innerHTML = `
            <div class="showcase-phone-layout">
                <aside class="showcase-sidebar" role="tablist">
                    ${sidebarHTML}
                </aside>
                <section class="showcase-stage">
                    <div class="showcase-glow"></div>
                    <div class="phone-mockup">
                        <div class="phone-notch"></div>
                        <div class="phone-reflection"></div>
                        <div class="phone-screen">
                            <img class="showcase-screen-img" src="${this.items[0].image}" alt="${this.items[0].title}">
                        </div>
                    </div>
                    <div class="showcase-details">
                        <div class="showcase-counter">
                            <span class="current">01</span>
                            <span class="divider">/</span>
                            <span class="total">${String(this.items.length).padStart(2, '0')}</span>
                        </div>
                        <div class="showcase-title-area">
                            <h5 class="showcase-subtitle"></h5>
                            <h3 class="showcase-title-text"></h3>
                        </div>
                        <p class="showcase-desc"></p>
                        <div class="showcase-progress-track">
                            <div class="showcase-progress-bar"></div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    renderBrowserLayout() {
        let slidesHTML = '';
        let navHTML = '';
        
        this.items.forEach((item, idx) => {
            slidesHTML += `
                <div class="browser-screen-slide">
                    <img src="${item.image}" alt="${item.title}">
                </div>
            `;
            navHTML += `
                <button class="timeline-nav-item" data-index="${idx}" aria-label="View slide ${idx + 1}: ${item.title}">
                    <h4>${item.title}</h4>
                    <p>${item.subtitle}</p>
                    <div class="timeline-nav-progress"></div>
                </button>
            `;
        });

        this.container.className = 'showcase-container showcase-browser-container';
        this.container.innerHTML = `
            <div class="showcase-browser-layout">
                <div class="browser-mockup">
                    <header class="browser-header">
                        <div class="browser-dots">
                            <span class="browser-dot red"></span>
                            <span class="browser-dot yellow"></span>
                            <span class="browser-dot green"></span>
                        </div>
                        <div class="browser-address-bar">
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" style="margin-right: 5px;">
                                <rect x="3" y="6" width="10" height="7" rx="1.5" stroke-width="1.2"/>
                                <path d="M5 6V4.5a3 3 0 1 1 6 0V6" stroke-width="1.2"/>
                            </svg>
                            <span class="browser-url">${this.currentUrlDomain}</span>
                        </div>
                    </header>
                    <div class="browser-screen-viewport">
                        <div class="browser-reflection"></div>
                        <div class="browser-screens-strip">
                            ${slidesHTML}
                        </div>
                    </div>
                </div>

                <div class="browser-details-panel">
                    <div class="showcase-counter">
                        <span class="current">01</span>
                        <span class="divider">/</span>
                        <span class="total">${String(this.items.length).padStart(2, '0')}</span>
                    </div>
                    <div class="showcase-details">
                        <div class="showcase-title-area">
                            <h5 class="showcase-subtitle"></h5>
                            <h3 class="showcase-title-text"></h3>
                        </div>
                        <p class="showcase-desc"></p>
                    </div>
                </div>

                <nav class="showcase-timeline-nav" role="tablist">
                    ${navHTML}
                </nav>
            </div>
        `;
    }

    renderDashboardLayout() {
        let bentoHTML = '';
        let allImagesHTML = '';
        
        this.items.forEach((group, groupIdx) => {
            bentoHTML += `
                <button class="bento-card-nav" data-index="${groupIdx}" aria-label="View module: ${group.bentoTitle}">
                    <span class="bento-card-badge">${group.bentoSubtitle}</span>
                    <div class="bento-card-title">
                        <h4>${group.bentoTitle}</h4>
                        <p>${group.bentoDesc}</p>
                    </div>
                    <div class="bento-card-progress"></div>
                </button>
            `;
            
            group.screens.forEach((scr, scrIdx) => {
                allImagesHTML += `
                    <img class="monitor-screen-img" src="${scr.image}" alt="${scr.title}" data-group="${groupIdx}" data-screen="${scrIdx}">
                `;
            });
        });

        this.container.className = 'showcase-container showcase-bento-container';
        this.container.innerHTML = `
            <div class="showcase-bento-layout">
                <nav class="bento-grid-nav" role="tablist">
                    ${bentoHTML}
                </nav>
                <section class="dashboard-display">
                    <div class="showcase-glow"></div>
                    <div class="monitor-mockup">
                        <div class="monitor-frame">
                            <div class="monitor-screen">
                                <div class="monitor-reflection"></div>
                                ${allImagesHTML}
                            </div>
                        </div>
                        <div class="monitor-stand-neck"></div>
                        <div class="monitor-stand-base"></div>
                    </div>
                    
                    <div class="monitor-controls">
                        <button class="monitor-arrow-btn prev-btn" aria-label="Previous screenshot">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 13L5 8l5-5"/></svg>
                        </button>
                        <div class="monitor-dots-container"></div>
                        <button class="monitor-arrow-btn next-btn" aria-label="Next screenshot">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 3l5 5-5 5"/></svg>
                        </button>
                    </div>
                    
                    <div class="showcase-details" style="margin-top: 24px;">
                        <div class="showcase-title-area">
                            <h5 class="showcase-subtitle"></h5>
                            <h3 class="showcase-title-text"></h3>
                        </div>
                        <p class="showcase-desc"></p>
                    </div>
                </section>
            </div>
        `;
    }

    /* ==========================================================================
       INTERACTION & TRANSITIONS
       ========================================================================== */

    bindEvents() {
        // Autoplay Pause on hover
        this.container.addEventListener('mouseenter', () => this.pauseTimer());
        this.container.addEventListener('mouseleave', () => this.resumeTimer());

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            // Only trigger if this container is in viewport
            const rect = this.container.getBoundingClientRect();
            const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
            if (!inViewport) return;

            if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.navigate(1);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.navigate(-1);
            }
        });

        // Swipe events for touch screens
        let touchStartX = 0;
        let touchEndX = 0;
        const swipeArea = this.container.querySelector('.phone-mockup') || 
                          this.container.querySelector('.browser-mockup') || 
                          this.container.querySelector('.monitor-mockup');

        if (swipeArea) {
            swipeArea.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            swipeArea.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchEndX - touchStartX;
                if (Math.abs(diff) > 40) {
                    this.navigate(diff > 0 ? -1 : 1);
                }
            }, { passive: true });
        }

        // Click nav items
        if (this.type === 'phone' || this.type === 'browser') {
            this.navItems.forEach((btn) => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.index);
                    this.showSlide(idx, 0, { resetTimer: true });
                });
            });
        } else if (this.type === 'dashboard') {
            this.bentoCards.forEach((card) => {
                card.addEventListener('click', () => {
                    const idx = parseInt(card.dataset.index);
                    this.showSlide(idx, 0, { resetTimer: true });
                });
            });

            this.prevBtn.addEventListener('click', () => this.navigate(-1));
            this.nextBtn.addEventListener('click', () => this.navigate(1));
        }

        // Bento card glow mousemove effect
        if (this.type === 'dashboard') {
            this.bentoCards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    card.style.setProperty('--x', `${x}px`);
                    card.style.setProperty('--y', `${y}px`);
                });
            });
        }
    }

    showSlide(index, subIndex = 0, { resetTimer = false } = {}) {
        const lastIndex = this.currentIndex;
        this.currentIndex = index;
        this.subIndex = subIndex;

        if (this.type === 'phone') {
            // Update Active sidebar card
            this.navItems.forEach((btn, idx) => {
                btn.classList.toggle('active', idx === index);
                const pBar = btn.querySelector('.showcase-nav-progress');
                if (pBar) pBar.style.width = idx === index ? '0%' : '0%';
            });

            // Smooth fade/scale image transition
            const activeItem = this.items[index];
            this.screenImg.style.opacity = '0';
            this.screenImg.style.transform = 'scale(0.97) translateY(4px)';
            
            setTimeout(() => {
                this.screenImg.src = activeItem.image;
                this.screenImg.alt = activeItem.title;
                this.screenImg.style.opacity = '1';
                this.screenImg.style.transform = 'scale(1) translateY(0)';
            }, 150);

            // Update details
            this.currentNum.textContent = String(index + 1).padStart(2, '0');
            this.subtitleText.textContent = activeItem.subtitle;
            this.titleText.textContent = activeItem.title;
            this.descriptionText.textContent = activeItem.description;

            // Scroll active nav item in viewport
            this.navItems[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });

        } else if (this.type === 'browser') {
            // Sliding strip transition
            this.screensStrip.style.transform = `translateX(-${index * 100}%)`;

            // Update Active nav item
            this.navItems.forEach((btn, idx) => {
                btn.classList.toggle('active', idx === index);
                const pBar = btn.querySelector('.timeline-nav-progress');
                if (pBar) pBar.style.width = '0%';
            });

            // Update details
            const activeItem = this.items[index];
            this.currentNum.textContent = String(index + 1).padStart(2, '0');
            this.subtitleText.textContent = activeItem.subtitle;
            this.titleText.textContent = activeItem.title;
            this.descriptionText.textContent = activeItem.description;
            
            // Format mock URL
            const cleanUrl = activeItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            this.addressUrl.textContent = `${this.currentUrlDomain}/${cleanUrl}`;

            // Scroll active timeline into view (mobile)
            this.navItems[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });

        } else if (this.type === 'dashboard') {
            // Update Bento sidebar items
            this.bentoCards.forEach((btn, idx) => {
                btn.classList.toggle('active', idx === index);
                const pBar = btn.querySelector('.bento-card-progress');
                if (pBar) pBar.style.width = '0%';
            });

            // Rebuild sub-dots indicators
            const group = this.items[index];
            this.dotsContainer.innerHTML = '';
            group.screens.forEach((_, sIdx) => {
                const dot = document.createElement('button');
                dot.className = `monitor-dot-btn ${sIdx === subIndex ? 'active' : ''}`;
                dot.setAttribute('aria-label', `View sub-screen ${sIdx + 1}`);
                dot.addEventListener('click', () => {
                    this.showSlide(index, sIdx, { resetTimer: true });
                });
                this.dotsContainer.appendChild(dot);
            });

            // Toggle active screenshot
            const allImages = this.monitorScreen.querySelectorAll('.monitor-screen-img');
            allImages.forEach(img => {
                const isCurrent = parseInt(img.dataset.group) === index && parseInt(img.dataset.screen) === subIndex;
                img.classList.toggle('active', isCurrent);
            });

            // Update details
            const activeScreen = group.screens[subIndex];
            this.subtitleText.textContent = activeScreen.subtitle;
            this.titleText.textContent = activeScreen.title;
            this.descriptionText.textContent = activeScreen.description;

            // Scroll active bento into view (mobile)
            this.bentoCards[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }

        // Adjust glow background color if specified
        if (this.glowElement) {
            const glowColors = [
                'radial-gradient(circle, rgba(123, 134, 232, 0.2) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(209, 178, 115, 0.16) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(98, 195, 112, 0.15) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(217, 106, 106, 0.15) 0%, transparent 70%)'
            ];
            this.glowElement.style.background = glowColors[index % glowColors.length];
        }

        // Setup timer progress animations
        if (resetTimer) {
            this.timerRemaining = this.autoplayDuration;
        }
        this.timerStartTime = Date.now();
        this.startProgressAnimation();
    }

    navigate(direction) {
        if (this.type === 'phone' || this.type === 'browser') {
            const nextIdx = (this.currentIndex + direction + this.items.length) % this.items.length;
            this.showSlide(nextIdx, 0, { resetTimer: true });
        } else if (this.type === 'dashboard') {
            const group = this.items[this.currentIndex];
            let nextSubIdx = this.subIndex + direction;

            if (nextSubIdx >= group.screens.length) {
                // Wrap to next Bento card group
                const nextGroupIdx = (this.currentIndex + 1) % this.items.length;
                this.showSlide(nextGroupIdx, 0, { resetTimer: true });
            } else if (nextSubIdx < 0) {
                // Wrap to previous Bento card group
                const prevGroupIdx = (this.currentIndex - 1 + this.items.length) % this.items.length;
                const prevGroup = this.items[prevGroupIdx];
                this.showSlide(prevGroupIdx, prevGroup.screens.length - 1, { resetTimer: true });
            } else {
                this.showSlide(this.currentIndex, nextSubIdx, { resetTimer: true });
            }
        }
    }

    /* ==========================================================================
       PROGRESS TIMER & AUTOPLAY ENGINE
       ========================================================================== */

    startProgressAnimation() {
        if (this.progressAnimationId) {
            cancelAnimationFrame(this.progressAnimationId);
        }

        const animate = () => {
            if (this.isHovered) return;

            const timePassed = Date.now() - this.timerStartTime;
            const progressRatio = Math.min(timePassed / this.timerRemaining, 1.0);
            const percentage = progressRatio * 100;

            this.updateProgressBar(percentage);

            if (progressRatio >= 1.0) {
                this.navigate(1);
            } else {
                this.progressAnimationId = requestAnimationFrame(animate);
            }
        };

        this.progressAnimationId = requestAnimationFrame(animate);
    }

    updateProgressBar(percentage) {
        // Overall global progress bar (details panel)
        if (this.progressBar) {
            this.progressBar.style.width = `${percentage}%`;
        }

        // Active individual nav item progress
        let activeBar = null;
        if (this.type === 'phone') {
            activeBar = this.navItems[this.currentIndex].querySelector('.showcase-nav-progress');
        } else if (this.type === 'browser') {
            activeBar = this.navItems[this.currentIndex].querySelector('.timeline-nav-progress');
        } else if (this.type === 'dashboard') {
            activeBar = this.bentoCards[this.currentIndex].querySelector('.bento-card-progress');
        }

        if (activeBar) {
            activeBar.style.width = `${percentage}%`;
        }
    }

    pauseTimer() {
        this.isHovered = true;
        cancelAnimationFrame(this.progressAnimationId);
        
        // Calculate remaining time
        const elapsed = Date.now() - this.timerStartTime;
        this.timerRemaining = Math.max(0, this.timerRemaining - elapsed);
    }

    resumeTimer() {
        this.isHovered = false;
        this.timerStartTime = Date.now();
        this.startProgressAnimation();
    }
}

// Global initializer
window.initProjectShowcase = function(elementId, config, options) {
    document.addEventListener('DOMContentLoaded', () => {
        new ProjectShowcase(elementId, config, options);
    });
};
