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
    var added = SH.stageItems(items);
    document.dispatchEvent(new CustomEvent("sh:open-cart"));
    var count = SH.cart().length;
    return JSON.stringify({
      ok: true,
      added: added,
      cart_count: count,
      paid: false,
      placed: false,
      message:
        "Items staged in the guest cart and drawer opened. Guest must review, edit, and place/pay themselves. Do not claim the order is paid or sent."
    });
  }

  function clientTools() {
    return {
      open_cart_with_items: function (parameters) {
        return openCartWithItems(parameters || {});
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
