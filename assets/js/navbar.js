document.addEventListener("DOMContentLoaded", () => {
  const current = window.location.pathname.split("/").pop() || "index.html";
  const navList = document.querySelector(".navbar-nav");

  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const target = href.split("/").pop();
    const isProjectPage = window.location.pathname.includes("/projects/") && target === "projects.html";
    link.classList.toggle("active", target === current || isProjectPage);
  });

  if (!navList) return;

  const indicator = document.createElement("span");
  indicator.className = "nav-indicator";
  navList.appendChild(indicator);

  const moveIndicator = (link) => {
    if (!link || window.innerWidth < 992) return;
    const listRect = navList.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    indicator.style.left = `${linkRect.left - listRect.left}px`;
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.opacity = "1";
  };

  const activeLink = navList.querySelector(".nav-link.active") || navList.querySelector(".nav-link");
  window.requestAnimationFrame(() => moveIndicator(activeLink));

  navList.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("mouseenter", () => moveIndicator(link));
    link.addEventListener("focus", () => moveIndicator(link));
  });

  navList.addEventListener("mouseleave", () => moveIndicator(activeLink));
  window.addEventListener("resize", () => moveIndicator(navList.querySelector(".nav-link.active")));
});
