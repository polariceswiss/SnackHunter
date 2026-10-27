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
    if (!chip || !chip.parentElement) return;
    var parent = chip.parentElement;
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

  setScrolled();
  spy();
  dockSpy();
  window.addEventListener("scroll", function () {
    setScrolled();
    spy();
    dockSpy();
  }, { passive: true });
})();
