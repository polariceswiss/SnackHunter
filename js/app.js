(function () {
  var SH = window.SH;
  var HOUSE = SH.HOUSE;
  function tr(es, en) { return window.L && L.lang() === "en" ? en : es; }
  var drop = null;
  try { drop = JSON.parse(localStorage.getItem("sh.drop") || "null"); } catch (e) {}
  var service = "recoger";
  var pay = "efectivo";
  var map, pin, houseMark;

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function milesLabel(n) {
    return n.toFixed(1) + tr(" millas", " miles");
  }

  function renderMenu() {
    var root = document.getElementById("menu-root");
    if (!root) return;
    var items = SH.menu();
    var en = tr(false, true);
    root.innerHTML = SH.GROUPS.map(function (group) {
      var rows = items.filter(function (item) { return item.group === group.id; });
      var photo = group.image
        ? '<figure class="section-photo"><img src="' + group.image + '?v=3" alt="' + (en && group.altEn ? group.altEn : group.alt) + '"></figure>'
        : "";
      var rule = en && group.ruleEn ? group.ruleEn : group.rule;
      return (
        '<section class="menu-block" id="' + group.id + '">' +
          photo +
          '<div class="menu-block-head"><h3>' + (en ? group.en : group.name) + '</h3><p lang="' + (en ? "es" : "en") + '">' + (en ? group.name : group.en) + '</p></div>' +
          '<ul class="dishes">' + rows.map(dishHtml).join("") + "</ul>" +
          (rule ? '<div class="rules"><p>' + rule + "</p></div>" : "") +
        "</section>"
      );
    }).join("") + '<p class="counter-note">' + tr("El carrito de golf cubre cinco millas. Más lejos, se recoge en la casa.", "The golf cart covers five miles. Farther out, you pick it up at the house.") + "</p>";
    root.querySelectorAll(".dish-open").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dish = btn.closest(".dish");
        var more = dish.querySelector(".dish-more");
        var open = dish.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        more.hidden = !open;
      });
    });
    root.querySelectorAll("[data-add]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        SH.addLine(btn.getAttribute("data-add"));
        btn.textContent = tr("Añadido", "Added");
        setTimeout(function () { btn.textContent = tr("Añadir", "Add"); }, 700);
      });
    });
  }

  function dishHtml(item) {
    var en = tr(false, true);
    var shot = item.shot
      ? '<img class="dish-shot" src="' + item.shot + '?v=2" alt="">'
      : "";
    var more = (item.about || item.shot)
      ? '<div class="dish-more" hidden>' + shot + (item.about ? '<p>' + (en ? item.aboutEn : item.about) + '</p><p class="en" lang="' + (en ? "es" : "en") + '">' + (en ? item.about : item.aboutEn) + "</p>" : "") + "</div>"
      : "";
    return (
      '<li class="dish">' +
        '<button class="dish-open" type="button" aria-expanded="false">' +
          '<span class="dish-copy"><h4>' + (en ? item.en : item.name) + '</h4><p class="en" lang="' + (en ? "es" : "en") + '">' + (en ? item.name : item.en) + "</p></span>" +
        "</button>" +
        more +
        '<div class="dish-buy"><span class="price">' + SH.money(item.cents) + "</span>" +
        (item.mark ? '<span class="mark">' + item.mark + "</span>" : "") +
        '<button class="add" type="button" data-add="' + item.id + '">' + tr("Añadir", "Add") + "</button></div>" +
      "</li>"
    );
  }

  function esc(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function renderCart() {
    var lines = SH.cart();
    var box = document.getElementById("cart-lines");
    var empty = document.getElementById("cart-empty");
    var rest = document.getElementById("cart-rest");
    if (!box) return;
    empty.hidden = lines.length > 0;
    rest.hidden = lines.length === 0;
    box.innerHTML = lines.map(function (line, index) {
      var item = SH.itemById(line.id);
      if (!item) return "";
      var seat = 1;
      var i;
      for (i = 0; i < index; i++) if (lines[i].id === line.id) seat += 1;
      var extras = item.extra
        ? '<div class="extras">' + Object.keys(SH.EXTRAS).map(function (key) {
          var extra = SH.EXTRAS[key];
          return '<button type="button" data-x="' + key + '" class="' + (line[key] ? "is-on" : "") + '">' + tr(extra.name, extra.en) + " " + SH.money(extra.cents) + "</button>";
        }).join("") + "</div>"
        : "";
      return (
        '<article class="cart-line" data-i="' + index + '"><h3>' + (tr(false, true) ? item.en : item.name) + '</h3><span class="line-price">' + SH.money(SH.lineCents(line)) + "</span>" +
        '<div class="qty"><button type="button" data-q="-1" aria-label="' + tr("Quitar este", "Remove this one") + '">–</button><span>' + seat + '</span><button type="button" data-q="1" aria-label="' + tr("Otro igual, para armarlo aparte", "Another one, built on its own") + '">+</button></div>' +
        extras +
        '<input class="wish" data-wish type="text" value="' + esc(line.wish) + '" placeholder="' + esc(tr("Sin cebolla, bien tostado…", "No onion, well toasted…")) + '" aria-label="' + tr("Este, a su gusto", "This one, their way") + '">' +
        "</article>"
      );
    }).join("");
    var bill = SH.totals(service);
    document.getElementById("sum-sub").textContent = SH.money(bill.sub);
    document.getElementById("sum-fee").textContent = SH.money(bill.fee);
    document.getElementById("sum-tax").textContent = SH.money(bill.tax);
    document.getElementById("sum-total").textContent = SH.money(bill.total);
    var payTotal = document.getElementById("pay-total");
    if (payTotal) payTotal.textContent = SH.money(bill.total);
    var count = lines.reduce(function (n, line) { return n + line.qty; }, 0);
    document.querySelectorAll("[data-count]").forEach(function (node) {
      node.textContent = String(count);
      if (node.closest(".dock")) node.hidden = count === 0;
    });
    var bar = document.getElementById("ticket-bar");
    if (bar) {
      bar.hidden = count === 0;
      bar.querySelector("[data-bar-total]").textContent = SH.money(bill.sub);
    }
    paintPay();
  }

  function openDrawer(view) {
    document.getElementById("scrim").hidden = false;
    var drawer = document.getElementById("drawer");
    drawer.hidden = false;
    showView(view || "cart");
    document.documentElement.classList.add("nav-open");
  }

  function closeDrawer() {
    document.getElementById("scrim").hidden = true;
    document.getElementById("drawer").hidden = true;
    document.getElementById("account").hidden = true;
    var panel = document.getElementById("nav-panel");
    if (!panel || panel.hasAttribute("hidden")) document.documentElement.classList.remove("nav-open");
  }

  function showView(name) {
    ["cart", "check", "ticket"].forEach(function (view) {
      document.getElementById("view-" + view).hidden = view !== name;
    });
    document.getElementById("drawer-title").textContent = name === "ticket" ? tr("Tu ticket", "Your ticket") : name === "check" ? tr("El pedido", "The order") : tr("La cesta", "The cart");
    if (name === "check") fillCheck();
  }

  function doorValue() {
    var door = document.getElementById("check-door");
    return door ? door.value.trim() : "";
  }

  function fillCheck() {
    var who = SH.profile();
    if (who) {
      document.getElementById("who-name").value = who.name || "";
      document.getElementById("who-phone").value = who.phone || "";
    }
    var street = document.getElementById("check-street");
    if (street && drop && !street.value && drop.label && drop.label !== "Pin en el mapa" && drop.label !== "Pin on the map" && drop.label !== "Tu ubicación" && drop.label !== "Your location") {
      street.value = drop.label;
    }
    var cfg = SH.settings();
    document.getElementById("opt-carrito").disabled = !cfg.delivery;
    paintService();
    paintDrop();
    paintPay();
    var bill = SH.totals(service);
    document.getElementById("pay-total").textContent = SH.money(bill.total);
    locateGuest();
  }

  function locateGuest(force) {
    var node = document.getElementById("drop-read");
    var street = document.getElementById("check-street");
    locateGuest.force = !!force;
    if (!navigator.geolocation) {
      if (node && !drop) node.textContent = tr("Este teléfono no da la ubicación. Escribe la calle y el número.", "This phone won't share location. Type the street and the number.");
      return;
    }
    if (node && (locateGuest.force || !(street && street.dataset.touched === "1"))) node.textContent = tr("Marcando tu calle…", "Marking your street…");
    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;
      fetch("https://photon.komoot.io/reverse?lat=" + lat + "&lon=" + lng)
        .then(function (res) { return res.json(); })
        .then(function (data) {
          var feature = (data.features || [])[0];
          var label = tr("Tu ubicación", "Your location");
          if (feature) {
            var p = feature.properties;
            label = [p.housenumber, p.street || p.name, p.city || p.district].filter(Boolean).join(" ") || label;
          }
          applyGps(lat, lng, label);
        })
        .catch(function () { applyGps(lat, lng, tr("Tu ubicación", "Your location")); });
    }, function () {
      if (drop) paintDrop();
      else if (node) node.textContent = tr("No pude leer el GPS. Escribe la calle y el número de la puerta.", "I couldn't read the GPS. Type the street and the door number.");
    }, { enableHighAccuracy: true, timeout: 9000, maximumAge: 20000 });
  }

  function applyGps(lat, lng, label) {
    var street = document.getElementById("check-street");
    var note = document.getElementById("check-error");
    var locked = street && street.dataset.touched === "1";
    var miles = SH.milesBetween(HOUSE.lat, HOUSE.lng, lat, lng);
    locateGuest.force = false;
    if (miles <= 0.12) {
      service = "recoger";
      paintService();
      if (note) note.textContent = tr("Estás en la casa. El pedido queda para recoger.", "You're at the house. The order is for pickup.");
      return;
    }
    if (miles > HOUSE.radiusMi + 0.05) {
      service = "recoger";
      paintService();
      if (note) note.textContent = tr("Quedas fuera de las cinco millas. Lo preparo para recoger en la casa.", "You're outside the five miles. I'll set it for pickup at the house.");
      return;
    }
    service = "carrito";
    paintService();
    if (locked && street && street.value) label = street.value;
    else if (street) street.value = label;
    setDrop({ label: label, lat: lat, lng: lng, door: doorValue() });
    if (map) map.flyTo([lat, lng], 17, { duration: 0.5 });
    var read = document.getElementById("drop-read");
    if (read) {
      read.textContent = /\d/.test(label)
        ? label + " · " + miles.toFixed(1) + tr(" millas. Si la puerta es otra, escríbela abajo.", " miles. If the door is different, type it below.")
        : tr("El GPS marcó la calle, sin el número. Escríbelo, y la puerta si hace falta.", "The GPS marked the street, without the number. Type it, and the door if you need it.");
    }
  }

  function paintService() {
    document.getElementById("opt-recoger").classList.toggle("is-on", service === "recoger");
    document.getElementById("opt-carrito").classList.toggle("is-on", service === "carrito");
    document.getElementById("drop-fields").hidden = service !== "carrito";
    var counter = document.querySelector('[data-pay="mostrador"]');
    if (counter) counter.hidden = service === "carrito";
    if (service === "carrito" && pay === "mostrador") pay = "efectivo";
    renderCart();
  }

  function paintPay() {
    document.querySelectorAll("[data-pay]").forEach(function (btn) {
      btn.classList.toggle("is-on", btn.getAttribute("data-pay") === pay);
    });
    var cfg = SH.settings();
    var zelle = document.getElementById("zelle-line");
    if (zelle) {
      zelle.hidden = pay !== "zelle";
      zelle.textContent = cfg.zelle ? "Zelle: " + cfg.zelle : tr("La casa te confirma el Zelle por teléfono.", "The house confirms the Zelle by phone.");
    }
  }

  function setDrop(next) {
    drop = next;
    try { localStorage.setItem("sh.drop", JSON.stringify(next)); } catch (e) {}
    if (pin && next) pin.setLatLng([next.lat, next.lng]);
    if (map && next) map.flyTo([next.lat, next.lng], 16, { duration: 0.6 });
    paintDrop();
  }

  function paintDrop() {
    var node = document.getElementById("drop-read");
    var live = document.getElementById("radio-live");
    if (!drop) {
      if (node) { node.textContent = tr("Escribe la calle con el número. El GPS la marca, la puerta la pones tú.", "Type the street with the number. The GPS marks it, you add the door."); node.classList.remove("is-out"); }
      if (live) live.textContent = tr("El círculo tiene cinco millas. El carrito no sale a pie.", "The circle is five miles. The cart does not go on foot.");
      return;
    }
    var miles = SH.milesBetween(HOUSE.lat, HOUSE.lng, drop.lat, drop.lng);
    var inside = miles <= HOUSE.radiusMi + 0.05;
    var sentence = inside
      ? drop.label + " · " + milesLabel(miles) + tr(". El carrito llega en unos ", ". The cart arrives in about ") + SH.eta(miles) + tr(" minutos.", " minutes.")
      : drop.label + tr(" queda a ", " is ") + milesLabel(miles) + tr(", fuera del círculo. Lo preparamos para recoger.", " away, outside the circle. We'll set it for pickup.");
    if (node) {
      node.textContent = sentence;
      node.classList.toggle("is-out", !inside);
    }
    if (live) live.textContent = sentence;
    if (!inside && service === "carrito") {
      service = "recoger";
      paintService();
    }
  }

  function searchAddress(q) {
    var query = q.trim();
    if (query.length < 4) return Promise.resolve([]);
    var url = "https://photon.komoot.io/api/?limit=5&lat=" + HOUSE.lat + "&lon=" + HOUSE.lng + "&q=" + encodeURIComponent(query + ", Miami");
    return fetch(url).then(function (res) { return res.json(); }).then(function (data) {
      return (data.features || []).map(function (feature) {
        var p = feature.properties;
        var label = [p.housenumber, p.street || p.name, p.city].filter(Boolean).join(" ");
        return { label: label || p.name, lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] };
      });
    });
  }

  function bindSuggest(input, list) {
    var timer;
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        searchAddress(input.value).then(function (rows) {
          list.innerHTML = rows.map(function (row, i) {
            return '<li><button type="button" data-i="' + i + '">' + row.label + "</button></li>";
          }).join("");
          list._rows = rows;
        }).catch(function () {
          list.innerHTML = "<li>" + tr("No pude buscar ahora. Toca el mapa y deja el pin.", "I couldn't search just now. Tap the map and drop the pin.") + "</li>";
        });
      }, 280);
    });
    list.addEventListener("click", function (event) {
      var btn = event.target.closest("button");
      if (!btn || !list._rows) return;
      var row = list._rows[Number(btn.getAttribute("data-i"))];
      input.value = row.label;
      input.dataset.touched = "1";
      list.innerHTML = "";
      setDrop(row);
    });
  }

  function placeOrder() {
    var name = document.getElementById("who-name").value.trim();
    var phone = document.getElementById("who-phone").value.trim();
    if (name.length < 2 || phone.length < 7) {
      document.getElementById("check-error").textContent = tr("Nombre y teléfono, para que el carrito sepa a quién llama.", "Name and phone, so the cart knows who to call.");
      return;
    }
    if (service === "carrito") {
      var typed = document.getElementById("check-street").value.trim();
      if (!drop && typed.length < 4) {
        document.getElementById("check-error").textContent = tr("Falta la calle. El GPS la marca, o la escribes tú.", "The street is missing. The GPS marks it, or you type it.");
        return;
      }
      if (!drop) {
        document.getElementById("check-error").textContent = tr("Elige la calle de la lista, o usa tu ubicación, para clavar el pin.", "Pick the street from the list, or use your location, to set the pin.");
        return;
      }
      if (typed) drop = { label: typed, lat: drop.lat, lng: drop.lng, door: doorValue() };
      if (!/\d/.test(drop.label || "")) {
        document.getElementById("check-error").textContent = tr("Falta el número de la casa. El GPS a veces lo deja fuera.", "The house number is missing. The GPS sometimes leaves it out.");
        return;
      }
      var miles = SH.milesBetween(HOUSE.lat, HOUSE.lng, drop.lat, drop.lng);
      if (miles > HOUSE.radiusMi + 0.05) {
        document.getElementById("check-error").textContent = tr("Esa calle está fuera de las cinco millas. Pasa a recoger.", "That street is outside the five miles. Switch to pickup.");
        service = "recoger";
        paintService();
        return;
      }
    }
    document.getElementById("check-error").textContent = "";
    var bill = SH.totals(service);
    var lines = SH.cart().map(function (line) {
      var item = SH.itemById(line.id);
      var bits = [];
      Object.keys(SH.EXTRAS).forEach(function (key) {
        if (line[key]) bits.push(SH.EXTRAS[key].name.toLowerCase());
      });
      if (line.wish && line.wish.trim()) bits.push(line.wish.trim());
      return { id: line.id, name: item.name, qty: 1, note: bits.join(", "), cents: SH.lineCents(line) };
    });
    var order = {
      id: SH.newId(),
      created: new Date().toISOString(),
      items: lines,
      service: service,
      drop: service === "carrito" ? { label: drop.label, lat: drop.lat, lng: drop.lng, door: doorValue() } : null,
      miles: service === "carrito" && drop ? Number(SH.milesBetween(HOUSE.lat, HOUSE.lng, drop.lat, drop.lng).toFixed(2)) : 0,
      eta: service === "carrito" && drop ? SH.eta(SH.milesBetween(HOUSE.lat, HOUSE.lng, drop.lat, drop.lng)) : SH.HOUSE.prepMin,
      guest: { name: name, phone: phone },
      pay: pay,
      paid: false,
      status: "nueva",
      sub: bill.sub,
      fee: bill.fee,
      tax: bill.tax,
      total: bill.total
    };
    SH.saveProfile({ name: name, phone: phone, email: (SH.profile() && SH.profile().email) || "", google: SH.profile() && SH.profile().google });
    SH.postOrder(order).then(function () {
      SH.clearCart();
      showTicket(order);
      paintMine();
    });
  }

  function showTicket(order) {
    var where = order.service === "carrito"
      ? order.drop.label + (order.drop.door ? ", " + order.drop.door : "")
      : HOUSE.address + ", " + HOUSE.city;
    var how = {
      efectivo: tr("Efectivo al llegar", "Cash on arrival"),
      zelle: "Zelle",
      tarjeta: tr("Tarjeta al llegar", "Card on arrival"),
      mostrador: tr("En el mostrador", "At the counter")
    }[order.pay];
    document.getElementById("ticket-body").innerHTML =
      '<div class="ticket"><p class="eyebrow">' + tr("Pedido", "Order") + "</p><em>" + order.id + "</em>" +
      "<p>" + (order.service === "carrito"
        ? tr("El carrito sale hacia ", "The cart leaves for ") + where + tr(". Unos ", ". About ") + order.eta + tr(" minutos.", " minutes.")
        : tr("Lo recoges en la casa. ", "You pick it up at the house. ") + where + ".") + "</p>" +
      "<p>" + how + " · " + SH.money(order.total) + "</p>" +
      "<p>" + tr("A nombre de ", "Under the name ") + order.guest.name + ".</p></div>";
    showView("ticket");
  }

  function paintMine() {
    var node = document.getElementById("mine");
    if (!node) return;
    var ids = [];
    try { ids = JSON.parse(localStorage.getItem("sh.mine") || "[]"); } catch (e) {}
    if (!ids.length) { node.hidden = true; return; }
    var order = SH.localOrders().filter(function (row) { return row.id === ids[0]; })[0];
    if (!order || order.status === "entregada" || order.status === "recogida" || order.status === "cancelada") {
      node.hidden = true;
      return;
    }
    var labels = tr(false, true)
      ? { nueva: "received", plancha: "on the press", carrito: "on the cart", lista: "ready" }
      : { nueva: "recibido", plancha: "en la plancha", carrito: "en el carrito", lista: "listo" };
    node.hidden = false;
    node.textContent = order.id + " · " + (labels[order.status] || order.status);
  }

  function mountMap() {
    var box = document.getElementById("map");
    if (!box || !window.L) {
      if (box) box.textContent = tr("El mapa necesita conexión para dibujar el círculo.", "The map needs a connection to draw the circle.");
      return;
    }
    map = L.map(box, { zoomControl: false, scrollWheelZoom: false }).setView([HOUSE.lat, HOUSE.lng], 15);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Tiles &copy; Esri",
      maxZoom: 16
    }).addTo(map);
    L.circle([HOUSE.lat, HOUSE.lng], {
      radius: HOUSE.radiusMi * 1609.344,
      color: "#c6a15b",
      weight: 1.4,
      fillColor: "#c6a15b",
      fillOpacity: 0.14
    }).addTo(map);
    houseMark = L.marker([HOUSE.lat, HOUSE.lng], {
      interactive: false,
      icon: L.divIcon({ className: "", html: '<div class="house-pin"></div>', iconSize: [18, 18] })
    }).addTo(map);
    var dropIcon = L.divIcon({ className: "", html: '<div class="drop-pin"></div>', iconSize: [16, 16] });
    pin = L.marker([HOUSE.lat, HOUSE.lng], { draggable: true, opacity: 0, icon: dropIcon }).addTo(map);
    pin.on("dragend", function () {
      var ll = pin.getLatLng();
      setDrop({ label: tr("Pin en el mapa", "Pin on the map"), lat: ll.lat, lng: ll.lng });
    });
    map.on("click", function (event) {
      pin.setOpacity(1);
      setDrop({ label: tr("Pin en el mapa", "Pin on the map"), lat: event.latlng.lat, lng: event.latlng.lng });
    });
    if (drop) {
      pin.setOpacity(1);
      pin.setLatLng([drop.lat, drop.lng]);
      var near = SH.milesBetween(HOUSE.lat, HOUSE.lng, drop.lat, drop.lng) < 0.8;
      if (near) map.setView([drop.lat, drop.lng], 16);
      paintDrop();
    }
    setTimeout(function () { map.invalidateSize(); }, 400);
  }

  function mountGoogle() {
    var slot = document.getElementById("google-slot");
    if (!slot) return;
    if (!HOUSE.googleClientId || !window.google || !google.accounts) {
      slot.innerHTML = '<button class="google-btn" type="button" id="google-soon">' + tr("Continuar con Google", "Continue with Google") + "</button>";
      document.getElementById("google-soon").addEventListener("click", function () {
        document.getElementById("google-note").hidden = false;
      });
      return;
    }
    google.accounts.id.initialize({
      client_id: HOUSE.googleClientId,
      callback: function (resp) {
        var part = resp.credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        var json = decodeURIComponent(Array.prototype.map.call(atob(part), function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));
        var data = JSON.parse(json);
        var prev = SH.profile() || {};
        SH.saveProfile({ name: data.name || "", email: data.email || "", phone: prev.phone || "", google: true });
        closeDrawer();
        paintAccount();
      }
    });
    google.accounts.id.renderButton(slot, { theme: "filled_black", size: "large", shape: "pill", text: "continue_with", width: 320 });
  }

  function paintAccount() {
    var who = SH.profile();
    var node = document.getElementById("account-state");
    var label = who && who.name ? who.name.split(" ")[0] : tr("Entrar", "Sign in");
    document.querySelectorAll("[data-account]").forEach(function (btn) {
      var dockLabel = btn.querySelector(".dock-label");
      if (dockLabel) dockLabel.textContent = who && who.name ? who.name.split(" ")[0] : tr("Yo", "Me");
      else btn.textContent = label;
    });
    if (!node) return;
    node.textContent = who && who.name
      ? tr("Estás como ", "You're in as ") + who.name + (who.email ? " · " + who.email : "") + "."
      : tr("Todavía sin nombre. El teléfono basta.", "No name yet. The phone is enough.");
  }

  function openAccount() {
    document.getElementById("scrim").hidden = false;
    document.getElementById("account").hidden = false;
    document.documentElement.classList.add("nav-open");
    paintAccount();
  }

  function bind() {
    document.getElementById("cesta") && document.getElementById("cesta").addEventListener("click", function () { openDrawer("cart"); });
    document.getElementById("dock-cesta") && document.getElementById("dock-cesta").addEventListener("click", function () { openDrawer("cart"); });
    document.getElementById("ticket-bar") && document.getElementById("ticket-bar").addEventListener("click", function () { openDrawer("cart"); });
    document.getElementById("drawer-x").addEventListener("click", closeDrawer);
    document.getElementById("scrim").addEventListener("click", closeDrawer);
    document.getElementById("to-check").addEventListener("click", function () { openDrawer("check"); });
    document.getElementById("back-cart").addEventListener("click", function () { showView("cart"); });
    document.getElementById("place").addEventListener("click", placeOrder);
    document.getElementById("opt-recoger").addEventListener("click", function () { service = "recoger"; paintService(); });
    document.getElementById("opt-carrito").addEventListener("click", function () {
      if (this.disabled) return;
      service = "carrito";
      paintService();
      locateGuest();
    });
    var locate = document.getElementById("locate");
    if (locate) locate.addEventListener("click", function () {
      var street = document.getElementById("check-street");
      if (street) delete street.dataset.touched;
      locateGuest(true);
    });
    var streetInput = document.getElementById("check-street");
    if (streetInput) streetInput.addEventListener("input", function () { this.dataset.touched = "1"; });
    document.querySelectorAll("[data-pay]").forEach(function (btn) {
      btn.addEventListener("click", function () { pay = btn.getAttribute("data-pay"); paintPay(); });
    });
    document.getElementById("cart-lines").addEventListener("input", function (event) {
      var field = event.target.closest("[data-wish]");
      if (!field) return;
      var row = field.closest(".cart-line");
      if (!row) return;
      SH.updateLine(Number(row.getAttribute("data-i")), { wish: field.value }, true);
    });
    document.getElementById("cart-lines").addEventListener("click", function (event) {
      var line = event.target.closest(".cart-line");
      if (!line) return;
      var index = Number(line.getAttribute("data-i"));
      if (event.target.hasAttribute("data-q")) {
        var row = SH.cart()[index];
        if (Number(event.target.getAttribute("data-q")) > 0) SH.addLine(row.id, index);
        else SH.updateLine(index, { qty: 0 });
      }
      if (event.target.hasAttribute("data-x")) {
        var key = event.target.getAttribute("data-x");
        var current = SH.cart()[index];
        var patch = {};
        patch[key] = !current[key];
        SH.updateLine(index, patch);
      }
    });
    document.querySelectorAll("[data-account]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var panel = document.getElementById("nav-panel");
        var toggle = document.querySelector(".nav-toggle");
        if (panel) panel.setAttribute("hidden", "");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
        openAccount();
      });
    });
    document.getElementById("account-x").addEventListener("click", closeDrawer);
    document.getElementById("save-phone").addEventListener("click", function () {
      var name = document.getElementById("acc-name").value.trim();
      var phone = document.getElementById("acc-phone").value.trim();
      if (name.length < 2) return;
      var prev = SH.profile() || {};
      SH.saveProfile({ name: name, phone: phone, email: prev.email || "", google: prev.google || false });
      closeDrawer();
      paintAccount();
    });
    document.getElementById("find-form").addEventListener("submit", function (event) { event.preventDefault(); });
    bindSuggest(document.getElementById("find-street"), document.getElementById("find-list"));
    bindSuggest(document.getElementById("check-street"), document.getElementById("check-list"));
    document.addEventListener("sh:cart", renderCart);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeDrawer();
    });
  }

  function bootGateReadout() {
    var read = document.getElementById("gate-mi");
    if (!read || sessionStorage.getItem("sh.gate")) return;
    var start = performance.now();
    function tick(now) {
      if (!document.getElementById("gate")) return;
      var t = Math.min(1, (now - start) / 4600);
      read.textContent = (t * 5).toFixed(1);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

    renderMenu();
    renderCart();
    paintAccount();
    bind();
    document.addEventListener("sh:lang", function () {
      renderMenu();
      renderCart();
      paintAccount();
      paintDrop();
      paintPay();
      paintMine();
    });
  SH.pullBook().then(function () {
    renderMenu();
    renderCart();
    paintDrop();
  });
  bootGateReadout();
  mountMap();
  window.addEventListener("load", function () {
    mountGoogle();
    SH.refreshMine().then(paintMine);
    setInterval(function () {
      SH.refreshMine().then(paintMine);
    }, 5000);
  });
})();
