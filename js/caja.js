(function () {
  var SH = window.SH;
  var HOUSE = SH.HOUSE;
  var map, layer;

  function openDesk() {
    sessionStorage.setItem("sh.caja", "1");
    document.getElementById("lock").hidden = true;
    document.getElementById("desk").hidden = false;
    fillHouse();
    fillPrices();
    refresh();
    mountMap();
  }

  function fillHouse() {
    var cfg = SH.settings();
    document.getElementById("delivery").checked = cfg.delivery;
    document.getElementById("fee").value = (cfg.fee / 100).toFixed(2);
    document.getElementById("tax").value = Math.round(cfg.tax * 1000) / 10;
    document.getElementById("zelle").value = cfg.zelle || "";
    document.getElementById("new-pin").value = cfg.pin;
  }

  function fillPrices() {
    var box = document.getElementById("prices");
    box.innerHTML = SH.menu().map(function (item) {
      return '<label class="price-row"><span>' + item.name + '</span><input data-price="' + item.id + '" value="' + (item.cents / 100).toFixed(2) + '" inputmode="decimal"></label>';
    }).join("");
  }

  function dollarsToCents(value) {
    var n = Number(String(value).replace(",", "."));
    if (!isFinite(n) || n < 0) return null;
    return Math.round(n * 100);
  }

  function statusButtons(order) {
    var next = {
      nueva: [["plancha", "A la plancha"], ["cancelada", "Cancelar"]],
      plancha: order.service === "carrito"
        ? [["carrito", "Salió el carrito"], ["cancelada", "Cancelar"]]
        : [["lista", "Lista"], ["cancelada", "Cancelar"]],
      carrito: [["entregada", "Entregada"]],
      lista: [["recogida", "Recogida"]],
      entregada: [],
      recogida: [],
      cancelada: []
    }[order.status] || [];
    return next.map(function (step) {
      return '<button type="button" data-status="' + step[0] + '" data-id="' + order.id + '">' + step[1] + "</button>";
    }).join("") + '<button class="ghost" type="button" data-paid="' + (order.paid ? "0" : "1") + '" data-id="' + order.id + '">' + (order.paid ? "Pagado" : "Marcar pagado") + "</button>";
  }

  function paint(rows) {
    var box = document.getElementById("orders");
    var live = rows.filter(function (order) {
      return order.status !== "entregada" && order.status !== "recogida" && order.status !== "cancelada";
    });
    var done = rows.filter(function (order) { return live.indexOf(order) < 0; }).slice(0, 6);
    var all = live.concat(done);
    if (!all.length) {
      box.innerHTML = '<p class="empty">Todavía no entra nadie.</p>';
    } else {
      box.innerHTML = all.map(function (order) {
        var where = order.service === "carrito" && order.drop
          ? order.drop.label + " · " + order.miles + " mi · " + order.eta + " min"
          : "Recoge en la casa";
        var items = (order.items || []).map(function (line) {
          return line.qty + " " + line.name + (line.note ? " (" + line.note + ")" : "");
        }).join(" · ");
        return (
          '<article class="order"><h3>' + order.id + "</h3>" +
          "<p>" + order.guest.name + " · " + order.guest.phone + "</p>" +
          "<p>" + items + "</p>" +
          "<p>" + where + " · " + SH.money(order.total) + " · " + order.pay + " · " + order.status + "</p>" +
          '<div class="actions">' + statusButtons(order) + "</div></article>"
        );
      }).join("");
    }
    paintMap(live);
  }

  function refresh() {
    SH.loadOrders().then(paint);
  }

  function mountMap() {
    var box = document.getElementById("caja-map");
    if (!box || !window.L || map) return;
    map = L.map(box, { zoomControl: false, scrollWheelZoom: false }).setView([HOUSE.lat, HOUSE.lng], 12);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Tiles &copy; Esri",
      maxZoom: 16
    }).addTo(map);
    L.circle([HOUSE.lat, HOUSE.lng], {
      radius: HOUSE.radiusMi * 1609.344,
      color: "#c6a15b",
      weight: 1.2,
      fillColor: "#c6a15b",
      fillOpacity: 0.12
    }).addTo(map);
    L.marker([HOUSE.lat, HOUSE.lng], {
      interactive: false,
      icon: L.divIcon({ className: "", html: '<div class="house-pin"></div>', iconSize: [14, 14] })
    }).addTo(map);
    layer = L.layerGroup().addTo(map);
    setTimeout(function () { map.invalidateSize(); }, 300);
  }

  function paintMap(live) {
    if (!layer) return;
    layer.clearLayers();
    live.forEach(function (order) {
      if (!order.drop) return;
      L.marker([order.drop.lat, order.drop.lng], {
        icon: L.divIcon({ className: "", html: '<div class="drop-pin"></div>', iconSize: [14, 14] })
      }).bindTooltip(order.id + " · " + order.guest.name).addTo(layer);
    });
  }

  document.getElementById("pin-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var pin = document.getElementById("pin").value.trim();
    function openWith(ok) {
      if (!ok) {
        document.getElementById("pin-error").textContent = "Esa no es la clave.";
        return;
      }
      sessionStorage.setItem("sh.cajaPin", pin);
      openDesk();
    }
    fetch("/api/orders", { headers: { "X-House-Pin": pin } }).then(function (res) {
      if (res.status === 401) { openWith(false); return; }
      openWith(res.ok || pin === String(SH.settings().pin));
    }).catch(function () {
      openWith(pin === String(SH.settings().pin));
    });
  });

  document.getElementById("out").addEventListener("click", function () {
    sessionStorage.removeItem("sh.caja");
    sessionStorage.removeItem("sh.cajaPin");
    location.reload();
  });

  document.getElementById("orders").addEventListener("click", function (event) {
    var btn = event.target.closest("button");
    if (!btn) return;
    var id = btn.getAttribute("data-id");
    var patch = {};
    if (btn.hasAttribute("data-status")) patch.status = btn.getAttribute("data-status");
    if (btn.hasAttribute("data-paid")) patch.paid = btn.getAttribute("data-paid") === "1";
    SH.patchOrder(id, patch).then(refresh);
  });

  document.getElementById("save-prices").addEventListener("click", function () {
    var over = {};
    document.querySelectorAll("[data-price]").forEach(function (input) {
      var cents = dollarsToCents(input.value);
      if (cents !== null) over[input.getAttribute("data-price")] = cents;
    });
    localStorage.setItem("sh.prices", JSON.stringify(over));
    SH.pushBook();
    document.getElementById("house-note").textContent = "La carta quedó guardada. Quien pida en esta casa la ve.";
  });

  document.getElementById("house-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var fee = dollarsToCents(document.getElementById("fee").value);
    var tax = Number(String(document.getElementById("tax").value).replace(",", "."));
    var pin = document.getElementById("new-pin").value.trim();
    SH.saveSettings({
      delivery: document.getElementById("delivery").checked,
      fee: fee === null ? 250 : fee,
      tax: isFinite(tax) ? tax / 100 : 0.07,
      zelle: document.getElementById("zelle").value.trim(),
      pin: pin || HOUSE.pin
    });
    document.getElementById("house-note").textContent = "La casa quedó guardada.";
    SH.pushBook();
  });

  if (sessionStorage.getItem("sh.caja") === "1") openDesk();
  setInterval(function () {
    if (!document.getElementById("desk").hidden) refresh();
  }, 4000);
})();
