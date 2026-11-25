(function () {
  "use strict";

  var AGENT_ID = "agent_0201m882mk8xf57sqc05ee2k7mz9";

  function parseItems(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      try {
        var parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : parsed && parsed.items ? parsed.items : [];
      } catch (err) {
        return [];
      }
    }
    if (raw.items) return parseItems(raw.items);
    return [];
  }

  function openCartWithItems(parameters) {
    var items = parseItems(parameters && (parameters.items || parameters));
    if (!window.SH || typeof SH.stageItems !== "function") {
      return JSON.stringify({
        ok: false,
        error: "Cart bridge not ready. Ask the guest to open the basket on the site."
      });
    }
    var result = SH.stageItems(items);
    var added = typeof result === "number" ? result : result.added;
    var flash = result && result.flash ? result.flash : [];
    setTimeout(function () {
      document.dispatchEvent(new CustomEvent("sh:open-cart"));
      if (flash.length) {
        document.dispatchEvent(new CustomEvent("sh:cart-flash", {
          detail: { index: Math.max(0, SH.cart().length - 1), flash: flash }
        }));
      }
    }, 850);
    return JSON.stringify({
      ok: true,
      added: added,
      cart_count: SH.cart().length,
      written: flash,
      paid: false,
      placed: false,
      message:
        "Items staged and written into the guest cart (skips/extras/notes). Drawer opened. Guest reviews and pays themselves. Do not claim paid or sent."
    });
  }

  function writeSpokenParts(parameters) {
    var raw = parameters || {};
    if (!window.SH || typeof SH.syncSpoken !== "function") {
      return JSON.stringify({ ok: false, error: "Cart bridge not ready." });
    }
    var res = SH.syncSpoken(raw);
    setTimeout(function () {
      document.dispatchEvent(new CustomEvent("sh:open-cart"));
    }, 850);
    return JSON.stringify({
      ok: !!res.ok,
      index: res.index,
      written: res.flash || [],
      cart_count: res.cart_count || SH.cart().length,
      paid: false,
      placed: false,
      message:
        "Opened the product on the menu, wrote the spoken parts into the cart. Guest can still edit. Do not claim payment done."
    });
  }

  function navigateMenuSection(parameters) {
    var raw = parameters || {};
    var target = raw.section || raw.id || raw.name || raw.target || "";
    if (!window.SH || typeof SH.goToSection !== "function") {
      return JSON.stringify({ ok: false, error: "Nav bridge not ready." });
    }
    var res = SH.goToSection(target, { expand: true });
    return JSON.stringify({
      ok: !!res.ok,
      section: res.section || null,
      itemId: res.itemId || null,
      expanded: !!res.expanded,
      message: res.ok
        ? (res.itemId
          ? "Opened and expanded " + res.itemId + " on the page in section " + res.section + "."
          : "Scrolled the page to the " + res.section + " menu section so the guest can browse it.")
        : "Unknown section or item. Use section ids (desayuno, jugos…) or exact menu item ids (bistec, jugo-pina…)."
    });
  }

  function clientTools() {
    return {
      open_cart_with_items: function (parameters) {
        return openCartWithItems(parameters || {});
      },
      write_spoken_parts: function (parameters) {
        return writeSpokenParts(parameters || {});
      },
      navigate_menu_section: function (parameters) {
        return navigateMenuSection(parameters || {});
      }
    };
  }

  window.elevenlabsConvaiClientTools = Object.assign(
    {},
    window.elevenlabsConvaiClientTools || {},
    clientTools()
  );

  function wireCall(event) {
    var detail = event.detail || {};
    var config = detail.config || (detail.config = {});
    config.clientTools = Object.assign({}, config.clientTools, clientTools());
  }

  window.addEventListener("elevenlabs-convai:call", wireCall);

  function mountWidget() {
    if (document.querySelector("elevenlabs-convai")) return;
    var el = document.createElement("elevenlabs-convai");
    el.setAttribute("agent-id", AGENT_ID);
    el.setAttribute("variant", "compact");
    el.setAttribute("action-text", "Order with Snack AI");
    el.setAttribute("avatar-image-url", "assets/logo-circle-512.png");
    el.className = "sh-voice-orb";
    el.addEventListener("elevenlabs-convai:call", wireCall);
    document.body.appendChild(el);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountWidget);
  } else {
    mountWidget();
  }
})();
