(() => {
  "use strict";

  const isProjectDetail = /\/projects\/[^/]+\.html$/i.test(window.location.pathname);
  const base = isProjectDetail ? "../" : "";
  const isLandingPage = (window.location.pathname.split("/").pop() || "index.html") === "index.html";

  document.querySelectorAll("footer").forEach((footer) => footer.remove());
  if (!isLandingPage) {
    const footer = document.createElement("footer");
    footer.innerHTML = '<p>&copy; <span id="year"></span> Varsha Jairam</p>';
    document.body.append(footer);
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  if (isProjectDetail) {
    const currentProject = window.location.pathname.split("/").pop();
    const projects = [
      ["greengrid.html", "Developer Tools", "GreenGrid", "A GitHub-authenticated DSA progress tracker built to keep momentum visible."],
      ["lunaops.html", "Simulation", "LunaOps", "A moon-rover mission simulator for coordinate navigation and planning."],
      ["aion.html", "AI", "Aion", "A calm personal intelligence system for thoughts, tasks, and projects."],
      ["triggerly.html", "Automation", "Triggerly", "A workflow engine for repeatable triggers, actions, and business logic."],
      ["synczone.html", "Platform", "SyncZone", "A campus collaboration hub for students, teams, and real-time work."],
      ["gallimart.html", "Android", "GalliMart", "A hyperlocal marketplace focused on nearby discovery and commerce."],
      ["medicore.html", "Healthcare", "MediCore", "A hospital management system for practical clinical workflows."],
      ["wanderwave.html", "Travel", "WanderWave", "An archive of early product thinking for itinerary planning and discovery."]
    ].filter(([href]) => href !== currentProject);
    const preferred = projects.filter(([href]) => href === "greengrid.html" || href === "lunaops.html");
    const remainder = projects.filter((project) => !preferred.includes(project));
    const pick = (items) => items.splice(Math.floor(Math.random() * items.length), 1)[0];
    const selected = [];
    while (selected.length < 2 && preferred.length) selected.push(pick(preferred));
    while (selected.length < 3 && remainder.length) selected.push(pick(remainder));
    document.querySelectorAll(".rec-grid").forEach((grid) => {
      grid.innerHTML = selected.map(([href, tag, title, description], index) => `<a class="rec-card reveal${index ? ` reveal-delay-${index}` : ""}" href="${href}"><div class="rec-card-tag">${tag}</div><h3>${title}</h3><p>${description}</p><span class="rec-card-arrow">Explore <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h6M7 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></a>`).join("");
      requestAnimationFrame(() => grid.querySelectorAll(".reveal").forEach((card) => card.classList.add("is-visible")));
    });
  }

  document.querySelectorAll(".aion-orb, .aion-panel").forEach((element) => element.remove());
  const aion = document.createElement("div");
  aion.className = "aion-core-widget";
  aion.innerHTML = `
    <button class="aion-orb" type="button" data-aion-launcher aria-expanded="false" aria-label="Open Aion Core"><img src="${base}assets/images/aion-mascot.svg" alt="" aria-hidden="true"></button>
    <aside class="aion-panel" data-aion-panel aria-label="Aion Core assistant">
      <div class="aion-panel-glow" aria-hidden="true"></div>
      <header class="aion-header"><div class="aion-brand"><span class="aion-brand-icon" aria-hidden="true">✦</span><div><strong>Aion Core</strong><span>Portfolio intelligence</span></div></div><button class="aion-close" type="button" data-aion-close aria-label="Close">×</button></header>
      <div class="aion-messages" data-aion-messages><div class="aion-empty" data-aion-empty><span class="aion-empty-icon">✦</span><p>Ask me about Varsha's work, skills, or projects.</p></div></div>
      <form class="aion-form" data-aion-form><div class="aion-input-wrap"><input data-aion-input type="text" placeholder="Ask about Varsha..." aria-label="Ask Aion Core" autocomplete="off"></div><button type="submit" aria-label="Send message">→</button></form>
    </aside>`;
  document.body.append(aion);

  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (/^(https?:|mailto:|tel:)/i.test(href || '')) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });
  const aionCore = document.createElement("script");
  aionCore.src = `${base}assets/js/aion-core.js`;
  document.body.append(aionCore);
})();
