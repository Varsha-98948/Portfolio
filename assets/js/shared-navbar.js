(() => {
  "use strict";

  const isProjectDetail = /\/projects\/[^/]+\.html$/i.test(window.location.pathname);
  const base = isProjectDetail ? "../" : "";
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const activePage = isProjectDetail || currentPage === "index.html" ? "home.html" : currentPage;
  const links = [
    ["home.html", "Home"],
    ["about.html", "About"],
    ["projects.html", "Projects"],
    ["resume.html", "Resume"]
  ];

  const style = document.createElement("style");
  style.id = "shared-navbar-styles";
  style.textContent = `
    .dock-wrap{position:fixed;top:22px;left:0;right:0;z-index:1000;display:flex;justify-content:center;padding:0 16px;transition:top .5s cubic-bezier(.16,1,.3,1)}
    .dock-wrap.tuck{top:12px}
    .dock{display:flex;align-items:center;gap:6px;padding:8px 8px 8px 18px;border-radius:999px;background:rgba(11,11,17,.62);backdrop-filter:blur(22px) saturate(1.5);-webkit-backdrop-filter:blur(22px) saturate(1.5);border:1px solid rgba(255,255,255,.08);box-shadow:0 12px 40px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.05);transition:padding .5s cubic-bezier(.16,1,.3,1),background .5s cubic-bezier(.16,1,.3,1)}
    .dock-wrap.tuck .dock{background:rgba(11,11,17,.82);padding:6px 6px 6px 16px}
    .dock-brand{display:flex;align-items:center;gap:9px;font-family:Inter,sans-serif;font-size:.98rem;padding-right:14px;margin-right:4px;border-right:1px solid rgba(255,255,255,.08);white-space:nowrap;color:#f3f2ee;text-decoration:none}
    .dock-brand .mark{width:24px;height:24px;border-radius:7px;display:grid;place-items:center;flex-shrink:0;background:linear-gradient(135deg,#e3a83a,#f0c063);color:#08080c;font-family:'Instrument Serif',serif;font-size:1rem;box-shadow:0 3px 10px rgba(227,168,58,.16)}
    .dock-brand b{font-weight:500;letter-spacing:-.01em}
    .dock-nav{position:relative;display:flex;align-items:center}
    .dock-pill{position:absolute;top:0;height:100%;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);transition:transform .45s cubic-bezier(.34,1.4,.5,1),width .45s cubic-bezier(.34,1.4,.5,1),opacity .3s;opacity:0;z-index:0}
    .dock-link{position:relative;z-index:1;font-family:Inter,sans-serif;font-size:.74rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:rgba(243,242,238,.30);padding:9px 16px;border-radius:999px;transition:color .35s;white-space:nowrap;text-decoration:none}
    .dock-link:hover,.dock-link.active{color:#f3f2ee}
    .dock-cta{z-index:1;margin-left:6px;font-family:Inter,sans-serif;font-size:.74rem;font-weight:600;letter-spacing:.02em;color:#08080c;background:#e3a83a;padding:10px 18px;border-radius:999px;transition:transform .4s cubic-bezier(.34,1.4,.5,1),box-shadow .4s;text-decoration:none}
    .dock-cta:hover{box-shadow:0 8px 24px rgba(227,168,58,.16);color:#08080c}
    .dock-burger{display:none;z-index:1;width:40px;height:40px;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.026);align-items:center;justify-content:center;flex-direction:column;gap:4px;cursor:pointer}
    .dock-burger span{width:16px;height:1.5px;background:#f3f2ee;transition:.35s cubic-bezier(.16,1,.3,1)}
    .dock-burger.open span:nth-child(1){transform:translateY(5.5px) rotate(45deg)}
    .dock-burger.open span:nth-child(2){opacity:0}
    .dock-burger.open span:nth-child(3){transform:translateY(-5.5px) rotate(-45deg)}
    .mobile-menu{position:fixed;inset:0;z-index:999;background:rgba(8,8,12,.96);backdrop-filter:blur(20px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;opacity:0;visibility:hidden;transition:.5s cubic-bezier(.16,1,.3,1)}
    .mobile-menu.open{opacity:1;visibility:visible}
    .mobile-menu a{font-family:'Instrument Serif',serif;font-size:2rem;color:rgba(243,242,238,.56);transition:color .3s;text-decoration:none}
    .mobile-menu a:hover{color:#e3a83a}
    @media(max-width:860px){.dock-brand b{display:none}.dock-nav,.dock-cta{display:none}.dock-burger{display:flex}}
  `;
  document.head.appendChild(style);

  const navbar = document.createElement("div");
  navbar.innerHTML = `
    <div class="dock-wrap" id="dockWrap">
      <nav class="dock" aria-label="Primary">
        <a class="dock-brand" href="${base}home.html"><span class="mark">V</span><b>Varsha Jairam</b></a>
        <div class="dock-nav" id="dockNav"><span class="dock-pill" id="dockPill"></span>${links.map(([href, label]) => `<a class="dock-link${href === activePage ? " active" : ""}" href="${base}${href}">${label}</a>`).join("")}</div>
        <a class="dock-cta" href="${base}contact.html">Contact</a>
        <button class="dock-burger" id="burger" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
      </nav>
    </div>
    <div class="mobile-menu" id="mobileMenu">${[...links, ["contact.html", "Contact"]].map(([href, label]) => `<a href="${base}${href}">${label}</a>`).join("")}</div>`;
  document.body.prepend(navbar);

  const dockWrap = document.getElementById("dockWrap");
  const dockNav = document.getElementById("dockNav");
  const pill = document.getElementById("dockPill");
  const dockLinks = dockNav.querySelectorAll(".dock-link");
  const activeLink = dockNav.querySelector(".dock-link.active");
  const movePill = (link) => {
    if (!link) { pill.style.opacity = "0"; return; }
    pill.style.opacity = "1";
    pill.style.width = `${link.offsetWidth}px`;
    pill.style.transform = `translateX(${link.offsetLeft}px)`;
  };
  const updateDock = () => dockWrap.classList.toggle("tuck", window.scrollY > 40);

  updateDock();
  window.addEventListener("scroll", updateDock, { passive: true });
  dockLinks.forEach((link) => link.addEventListener("mouseenter", () => movePill(link)));
  dockNav.addEventListener("mouseleave", () => movePill(activeLink));
  window.addEventListener("load", () => movePill(activeLink));
  window.addEventListener("resize", () => movePill(activeLink));
  setTimeout(() => movePill(activeLink), 200);

  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  burger.addEventListener("click", () => {
    const isOpen = burger.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.classList.toggle("open", isOpen);
  });
  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("open");
  }));
})();
