// Shared header, footer, and scroll reveal for every page.
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
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  };

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
      </ul>
      <div class="nav-tools">
        <button class="icon-btn menu-btn" id="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">${icons.menu}</button>
      </div>
    </nav>`;
  document.body.prepend(header);

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
            <ul>${NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}</ul>
          </div>
          <div>
            <h4>Texas A&amp;M</h4>
            <ul>
              <li><a href="https://engineering.tamu.edu">College of Engineering</a></li>
              <li><a href="https://engineering.tamu.edu/chemical/">Chemical Engineering</a></li>
              <li><a href="https://tees.tamu.edu">TEES</a></li>            </ul>
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
