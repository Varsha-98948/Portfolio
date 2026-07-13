/* ==========================================================
   SYNCZONE TOUR
========================================================== */

const screens = [

    {
        number: "01",

        title: "Splash Screen",

        subtitle: "Launch Experience",

        description:
            "Experience the branded launch screen before entering SyncZone.",

        image:
            "../assets/images/projects/synczone/01_Splash.png"
    },

    {
        number: "02",

        title: "Login",

        subtitle: "Secure Authentication",

        description:
            "Sign in securely using your registered credentials and access your personalized workspace.",

        image:
            "../assets/images/projects/synczone/02_Login.png"
    },

    {
        number: "03",

        title: "Register",

        subtitle: "Create Account",

        description:
            "New students and teachers can register and join their institution with ease.",

        image:
            "../assets/images/projects/synczone/03_Register.png"
    },

    {
        number: "04",

        title: "Forgot Password",

        subtitle: "Account Recovery",

        description:
            "Recover access to your account through a simple password reset workflow.",

        image:
            "../assets/images/projects/synczone/04_Forgot_Password.png"
    },

    {
        number: "05",

        title: "Student Chat",

        subtitle: "Real-Time Messaging",

        description:
            "Students collaborate through Firebase-powered real-time conversations inside course chatrooms.",

        image:
            "../assets/images/projects/synczone/05_Stud_Chat.png"
    },

    {
        number: "06",

        title: "Teacher Chat",

        subtitle: "Faculty Communication",

        description:
            "Teachers communicate with students while maintaining structured classroom discussions.",

        image:
            "../assets/images/projects/synczone/06_Teach_Chat.png"
    },

    {
        number: "07",

        title: "Student Announcements",

        subtitle: "Stay Updated",

        description:
            "Students receive important announcements, events and academic notices instantly.",

        image:
            "../assets/images/projects/synczone/07_Stud_Announcement.png"
    },

    {
        number: "08",

        title: "Teacher Announcements",

        subtitle: "Publish Updates",

        description:
            "Faculty members can broadcast announcements across classes with a single action.",

        image:
            "../assets/images/projects/synczone/08_Teach_Announcement.png"
    },

    {
        number: "09",

        title: "Student Assignments",

        subtitle: "Coursework",

        description:
            "Track assignments, deadlines and submissions from one organized dashboard.",

        image:
            "../assets/images/projects/synczone/09_Stud_Assignment.png"
    },

    {
        number: "10",

        title: "Teacher Assignments",

        subtitle: "Assignment Management",

        description:
            "Teachers can create, distribute and manage assignments efficiently.",

        image:
            "../assets/images/projects/synczone/10_Teach_Assignment.png"
    },

    {
        number: "11",

        title: "Student Profile",

        subtitle: "Personal Dashboard",

        description:
            "Manage personal information, account settings and profile details from one place.",

        image:
            "../assets/images/projects/synczone/11_Stud_Profile.png"
    },

    {
        number: "12",

        title: "Teacher Profile",

        subtitle: "Faculty Dashboard",

        description:
            "Faculty profiles centralize teaching information and institutional details.",

        image:
            "../assets/images/projects/synczone/12_Teach_Profile.png"
    }

];
/* ==========================================================
   DOM
========================================================== */

const tourList = document.querySelector(".tour-list");

const tourImage = document.getElementById("tour-image");

const tourTitle = document.getElementById("tour-title");

const tourSubtitle = document.getElementById("tour-subtitle");

const tourDescription = document.getElementById("tour-description");

const currentNumber = document.getElementById("tour-current");

const progressFill = document.querySelector(".tour-progress-fill");

let currentIndex = 0;

let autoPlay;
/* ==========================================================
   CREATE SIDEBAR
========================================================== */

function buildSidebar() {

    tourList.innerHTML = "";

    screens.forEach((screen, index) => {

        const card = document.createElement("div");

        card.className = "tour-card";

        card.dataset.index = index;

        card.innerHTML = `

            <div class="tour-index">

                ${screen.number}

            </div>

            <div class="tour-info">

                <h4>${screen.title}</h4>

                <p>${screen.subtitle}</p>

            </div>

        `;

        card.addEventListener("click", () => {

            showScreen(index);

        });

        tourList.appendChild(card);

    });

}
/* ==========================================================
   SHOW SCREEN
========================================================== */

function showScreen(index) {

    currentIndex = index;

    const screen = screens[index];

    // Animate out

    tourImage.classList.add("tour-image-changing");

    tourTitle.classList.add("tour-text-changing");

    tourSubtitle.classList.add("tour-text-changing");

    tourDescription.classList.add("tour-text-changing");

    setTimeout(() => {

        updateContent(screen);

    }, 180);

}
/* ==========================================================
   UPDATE CONTENT
========================================================== */

function updateContent(screen) {

    tourImage.src = screen.image;

    tourImage.alt = screen.title;

    currentNumber.textContent = screen.number;

    tourTitle.textContent = screen.title;

    tourSubtitle.textContent = screen.subtitle;

    tourDescription.textContent = screen.description;

    progressFill.style.width =
        `${((currentIndex + 1) / screens.length) * 100}%`;

    updateSidebar();

    requestAnimationFrame(() => {

        tourImage.classList.remove("tour-image-changing");

        tourTitle.classList.remove("tour-text-changing");

        tourSubtitle.classList.remove("tour-text-changing");

        tourDescription.classList.remove("tour-text-changing");

    });

}
/* ==========================================================
   SIDEBAR ACTIVE
========================================================== */

function updateSidebar() {

    const cards = document.querySelectorAll(".tour-card");

    cards.forEach((card, index) => {

        card.classList.toggle(
            "active",
            index === currentIndex
        );

    });

    cards[currentIndex].scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}
/* ==========================================================
   NEXT / PREVIOUS
========================================================== */

function nextScreen() {

    const next = (currentIndex + 1) % screens.length;

    showScreen(next);

}

function previousScreen() {

    const prev =
        (currentIndex - 1 + screens.length) % screens.length;

    showScreen(prev);

}
/* ==========================================================
   AUTOPLAY
========================================================== */

function startAutoplay() {

    stopAutoplay();

    autoPlay = setInterval(() => {

        nextScreen();

    }, 4000);

}

function stopAutoplay() {

    clearInterval(autoPlay);

}
/* ==========================================================
   HOVER
========================================================== */

const showcase =
    document.querySelector(".synczone-showcase");

showcase.addEventListener("mouseenter", () => {

    stopAutoplay();

});

showcase.addEventListener("mouseleave", () => {

    startAutoplay();

});
/* ==========================================================
   KEYBOARD
========================================================== */

document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowRight") {

        nextScreen();

    }

    if (event.key === "ArrowLeft") {

        previousScreen();

    }

});
/* ==========================================================
   TOUCH
========================================================== */

let touchStart = 0;

let touchEnd = 0;

tourImage.addEventListener("touchstart", (event) => {

    touchStart = event.changedTouches[0].screenX;

});

tourImage.addEventListener("touchend", (event) => {

    touchEnd = event.changedTouches[0].screenX;

    handleSwipe();

});

function handleSwipe() {

    if (touchEnd < touchStart - 40) {

        nextScreen();

    }

    if (touchEnd > touchStart + 40) {

        previousScreen();

    }

}
function showScreen(index) {

    currentIndex = index;

    const screen = screens[index];

    tourImage.animate(
        [
            {
                opacity: 1,
                transform: "translateX(0px) scale(1)"
            },
            {
                opacity: 0,
                transform: "translateX(-24px) scale(.98)"
            }
        ],
        {
            duration: 180,
            easing: "ease"
        }
    );

    tourTitle.animate(
        [
            {
                opacity: 1,
                transform: "translateY(0px)"
            },
            {
                opacity: 0,
                transform: "translateY(8px)"
            }
        ],
        {
            duration: 180
        }
    );

    setTimeout(() => {

        updateContent(screen);

        tourImage.animate(
            [
                {
                    opacity: 0,
                    transform: "translateX(24px) scale(.98)"
                },
                {
                    opacity: 1,
                    transform: "translateX(0px) scale(1)"
                }
            ],
            {
                duration: 260,
                easing: "ease-out"
            }
        );

        tourTitle.animate(
            [
                {
                    opacity: 0,
                    transform: "translateY(10px)"
                },
                {
                    opacity: 1,
                    transform: "translateY(0)"
                }
            ],
            {
                duration: 260
            }
        );

    },180);

}
/* ==========================================================
   INIT
========================================================== */

buildSidebar();

showScreen(0);

startAutoplay();