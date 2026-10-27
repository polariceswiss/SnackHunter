(function () {
  var root = document.documentElement;
  root.classList.add("js");

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.querySelector(".nav-panel");
  var links = document.querySelectorAll(".nav-panel a, .carta-index a");

  function setScrolled() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  function closeNav() {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", "false");
    panel.setAttribute("hidden", "");
    var drawer = document.getElementById("drawer");
    var account = document.getElementById("account");
    var sheets = (drawer && !drawer.hidden) || (account && !account.hidden);
    if (!sheets) root.classList.remove("nav-open");
  }

  function openNav() {
    toggle.setAttribute("aria-expanded", "true");
    panel.removeAttribute("hidden");
    root.classList.add("nav-open");
  }

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") closeNav();
      else openNav();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNav();
  });

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      closeNav();
    });
  });

  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && reveals.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  var spyLinks = document.querySelectorAll("[data-spy]");
  var sections = Array.prototype.map
    .call(spyLinks, function (link) {
      var id = link.getAttribute("href");
      return id ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  var spyId = "";

  function revealChip(id) {
    if (!window.matchMedia("(max-width: 899px)").matches) return;
    var chip = document.querySelector('.carta-index a[href="#' + id + '"]');
    var parent = chip && chip.closest(".carta-index");
    if (!chip || !parent) return;
    if (parent.scrollWidth <= parent.clientWidth + 8) return;
    parent.scrollTo({
      left: Math.max(0, chip.offsetLeft - (parent.clientWidth - chip.offsetWidth) / 2),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  }

  function spy() {
    var mark = window.scrollY + 140;
    var current = null;
    sections.forEach(function (section) {
      if (!section.getClientRects().length) return;
      if (section.offsetTop <= mark) current = section;
    });
    if (!current) {
      sections.some(function (section) {
        if (!section.getClientRects().length) return false;
        current = section;
        return true;
      });
    }
    spyLinks.forEach(function (link) {
      var on = current && link.getAttribute("href") === "#" + current.id;
      link.classList.toggle("is-active", Boolean(on));
    });
    var id = current ? current.id : "";
    if (id && id !== spyId) {
      spyId = id;
      revealChip(id);
    }
  }

  var dock = document.querySelector(".dock");

  function dockSpy() {
    if (!dock) return;
    var y = window.scrollY + 120;
    var carta = document.getElementById("carta");
    var radio = document.getElementById("radio");
    var id = "top";
    if (radio && radio.offsetTop <= y) id = "radio";
    else if (carta && carta.offsetTop <= y) id = "carta";
    dock.querySelectorAll("a").forEach(function (link) {
      link.classList.toggle("is-on", link.getAttribute("href") === "#" + id);
    });
  }

  var reel = document.querySelector(".hero-reel");
  var dots = document.querySelectorAll(".hero-dots span");
  if (reel && dots.length) {
    reel.addEventListener("scroll", function () {
      var index = Math.round(reel.scrollLeft / Math.max(reel.clientWidth, 1));
      dots.forEach(function (dot, i) { dot.classList.toggle("is-on", i === index); });
    }, { passive: true });
  }

  var themeBtn = document.getElementById("theme-btn");

  function paintTheme() {
    var light = root.getAttribute("data-theme") === "light";
    if (!themeBtn || !window.L) return;
    var sun = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 2.6v2.1M12 19.3v2.1M2.6 12h2.1M19.3 12h2.1M5.1 5.1l1.5 1.5M17.4 17.4l1.5 1.5M18.9 5.1l-1.5 1.5M6.6 17.4l-1.5 1.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
    var moon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 3.4a7.6 7.6 0 1 0 4.8 12.4A6.7 6.7 0 0 1 16 3.4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
    themeBtn.innerHTML = light ? moon : sun;
    themeBtn.setAttribute("aria-label", light ? L.t("themeDark") : L.t("themeLight"));
    themeBtn.setAttribute("aria-pressed", light ? "true" : "false");
    var chrome = document.querySelector('meta[name="theme-color"]');
    if (chrome) chrome.setAttribute("content", light ? "#f4efe6" : "#000000");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      if (next === "dark") root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", "light");
      try { localStorage.setItem("sh.theme", next); } catch (e) {}
      paintTheme();
    });
  }

  document.addEventListener("sh:lang", paintTheme);
  paintTheme();

  var index = document.querySelector(".carta-index");
  var indexBtn = document.querySelector(".index-toggle");

  function setIndex(shut) {
    if (!index || !indexBtn) return;
    index.classList.toggle("is-shut", shut);
    root.classList.toggle("index-shut", shut);
    indexBtn.setAttribute("aria-expanded", shut ? "false" : "true");
  }

  if (index && indexBtn) {
    indexBtn.addEventListener("click", function () {
      var shut = !index.classList.contains("is-shut");
      setIndex(shut);
      try { sessionStorage.setItem("sh.index", shut ? "0" : "1"); } catch (e) {}
    });
    try {
      if (sessionStorage.getItem("sh.index") === "0") setIndex(true);
    } catch (e) {}
  }

  var lastY = window.scrollY;

  function trackHeader() {
    var y = window.scrollY;
    if (y < 48) root.classList.remove("header-away");
    else if (y > lastY + 8) root.classList.add("header-away");
    else if (y < lastY - 8) root.classList.remove("header-away");
    lastY = y;
  }

  setScrolled();
  spy();
  dockSpy();
  trackHeader();
  window.addEventListener("scroll", function () {
    setScrolled();
    spy();
    dockSpy();
    trackHeader();
  }, { passive: true });
})();
