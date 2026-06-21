document.addEventListener("DOMContentLoaded", () => {
    const launcher = document.querySelector("[data-aion-launcher]");
    const panel = document.querySelector("[data-aion-panel]");
    const close = document.querySelector("[data-aion-close]");
    const form = document.querySelector("[data-aion-form]");
    const input = document.querySelector("[data-aion-input]");
    const messages = document.querySelector("[data-aion-messages]");

    if (!launcher || !panel || !form || !input || !messages) return;

    const intents = [
        {
            patterns: ["name", "who", "about varsha", "introduce", "student"],
            answer: "Varsha Jairam is a Computer Engineering student who builds software products, AI systems, Android applications, and automation platforms."
        },
        {
            patterns: ["tagline", "theme", "connect", "portfolio about", "brand"],
            answer: "Her portfolio theme is: Building products that connect people, information, and ideas."
        },
        {
            patterns: ["education", "cgpa", "diploma", "ssc", "marks", "percentage", "academic"],
            answer: "Education: B.E. Computer Engineering with a 9.05 CGPA, Diploma with 93.33%, and SSC with 86.4%."
        },
        {
            patterns: ["skills", "technology", "tech", "stack", "tools", "languages", "android", "firebase", "javascript"],
            answer: "Varsha works across product development, Android, AI and automation, Java, Firebase, Bootstrap, vanilla JavaScript, NoSQL, APIs, and workflow design."
        },
        {
            patterns: ["aion", "ai project", "personal assistant", "assistant", "second brain", "memory", "explain aion", "tell me about aion", "thoughts"],
            answer: "Aion is an in-development personal intelligence product: a second brain for thoughts, memories, tasks, and projects. Aion Core is the local version inside this portfolio."
        },
        {
            patterns: ["triggerly", "automation", "workflow", "trigger", "action", "zapier"],
            answer: "Triggerly is an automation platform under development, focused on triggers, actions, and workflow automation."
        },
        {
            patterns: ["synczone", "campus", "teacher", "student", "chat", "assignment", "notes"],
            answer: "SyncZone is a campus collaboration platform with announcements, notes, assignments, professional messaging, teacher authentication, realtime chat, dashboards, and profanity filtering."
        },
        {
            patterns: ["gallimart", "marketplace", "hyperlocal", "7 km", "osmdroid", "barcode", "inventory"],
            answer: "GalliMart is a major Android hyperlocal marketplace project where customers order within 7 km, with OSMDroid integration and future offline inventory support using barcode scanners."
        },
        {
            patterns: ["lunaops", "moon", "rover", "simulation", "coordinate", "robot"],
            answer: "LunaOps is a moon rover simulation platform for coordinate-based navigation, designed to evolve from simulated APIs to robotic hardware."
        },
        {
            patterns: ["medicore", "hospital", "medical", "nosql", "sql", "query"],
            answer: "MediCore is a hospital management platform that stores data using NoSQL while allowing SQL-like querying."
        },
        {
            patterns: ["wanderwave", "archive", "archived", "old project", "early"],
            answer: "WanderWave is an archived project included as part of Varsha's early product-building journey."
        },
        {
            patterns: ["contact", "email", "github", "linkedin", "reach", "hire", "connect"],
            answer: "You can reach Varsha through the Contact page, GitHub, LinkedIn, or the email link shown there."
        }
    ];

    const normalize = (text) => text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const scoreIntent = (question, intent) => {
        const normalized = normalize(question);
        const words = new Set(normalized.split(" "));

        return intent.patterns.reduce((score, pattern) => {
            const cleanPattern = normalize(pattern);
            if (normalized.includes(cleanPattern)) {
                return score + cleanPattern.split(" ").length + 3;
            }

            return score + cleanPattern.split(" ").filter((word) => words.has(word)).length;
        }, 0);
    };

    const addMessage = (text, type = "bot") => {
        const bubble = document.createElement("div");
        bubble.className = `aion-message ${type}`;
        bubble.textContent = text;
        messages.appendChild(bubble);
        messages.scrollTop = messages.scrollHeight;
    };

    const respond = (question) => {
        const ranked = intents
            .map((intent) => ({ intent, score: scoreIntent(question, intent) }))
            .sort((a, b) => b.score - a.score);

        return ranked[0]?.score > 0
            ? ranked[0].intent.answer
            : "I can answer questions about Varsha, Aion, Triggerly, projects, education, technologies, and current focus. Try asking: What is your second brain project?";
    };

    launcher.addEventListener("click", () => {
        panel.classList.toggle("is-open");
        launcher.setAttribute("aria-expanded", panel.classList.contains("is-open"));

        if (panel.classList.contains("is-open") && !messages.dataset.seeded) {
            addMessage("Hi, I am Aion Core. Ask me about Varsha's products, technologies, education, or project direction.");
            messages.dataset.seeded = "true";
        }

        input.focus();
    });

    close?.addEventListener("click", () => {
        panel.classList.remove("is-open");
        launcher.setAttribute("aria-expanded", "false");
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const question = input.value.trim();
        if (!question) return;

        addMessage(question, "user");
        input.value = "";
        window.setTimeout(() => addMessage(respond(question)), 180);
    });
});
