// Shared header, footer, theme toggle, and scroll reveal for every page.
(function () {
  const NAV = [
    { href: "index.html", label: "Home" },
    { href: "jayaraman.html", label: "Dr. Jayaraman" },
    { href: "research.html", label: "Research" },
    { href: "people.html", label: "People" },
    { href: "news.html", label: "News" },
  ];

  const here = location.pathname.split("/").pop() || "index.html";
  const current = (href) => (href === here ? ' aria-current="page"' : "");

  const icons = {
    sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    spark: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/></svg>',
  };

  // ---- Theme (remembered per browser) ----
  const root = document.documentElement;
  try {
    const saved = localStorage.getItem("theme");
    if (saved) root.dataset.theme = saved;
  } catch (e) {}
  const isDark = () =>
    root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;

  // ---- Header ----
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <nav class="container nav" aria-label="Main">
      <a class="brand" href="index.html">
        <span class="brand-mark">J</span>
        <span class="brand-text"><strong>Jayaraman Lab</strong><span>Texas A&amp;M Chemical Engineering</span></span>
      </a>
      <ul class="nav-links" id="nav-links">
        ${NAV.map((n) => `<li><a href="${n.href}"${current(n.href)}>${n.label}</a></li>`).join("")}
        <li><a class="nav-cta" href="chat.html"${current("chat.html")}>${icons.spark} Ask the Lab AI</a></li>
      </ul>
      <div class="nav-tools">
        <button class="icon-btn" id="theme-btn" type="button" aria-label="Toggle dark mode"></button>
        <button class="icon-btn menu-btn" id="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">${icons.menu}</button>
      </div>
    </nav>`;
  document.body.prepend(header);

  const themeBtn = header.querySelector("#theme-btn");
  const paintThemeBtn = () => (themeBtn.innerHTML = isDark() ? icons.sun : icons.moon);
  paintThemeBtn();
  themeBtn.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    paintThemeBtn();
  });

  const menuBtn = header.querySelector("#menu-btn");
  const links = header.querySelector("#nav-links");
  menuBtn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  // ---- Footer (omitted on the full-height chat page) ----
  if (!document.body.classList.contains("chat-page")) {
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="brand" style="margin-bottom:12px"><span class="brand-mark">J</span><span class="brand-text"><strong>Jayaraman Research Group</strong><span>Artie McFerrin Department of Chemical Engineering</span></span></div>
            <p>Engineering technologies to understand the gut microbiome and its interactions with the host.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>${NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}<li><a href="chat.html">Ask the Lab AI</a></li></ul>
          </div>
          <div>
            <h4>Texas A&amp;M</h4>
            <ul>
              <li><a href="https://engineering.tamu.edu">College of Engineering</a></li>
              <li><a href="https://engineering.tamu.edu/chemical/">Chemical Engineering</a></li>
              <li><a href="https://tees.tamu.edu">TEES</a></li>
              <li><a href="https://jayaraman.engr.tamu.edu/">Official lab site</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">© 2016–${new Date().getFullYear()} Jayaraman Research Group · Texas A&amp;M University</div>
      </div>`;
    document.body.append(footer);
  }

  // ---- Scroll reveal ----
  const els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("in"));
  }
})();
