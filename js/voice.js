(function () {
  "use strict";

  var AGENT_ID = "agent_0201m882mk8xf57sqc05ee2k7mz9";
  var DESKTOP = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent || "");

  // PC speakers leak into the mic → force browser AEC/NS/AGC on every mic grab.
  if (DESKTOP && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function") {
    var origGum = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function (constraints) {
      var next = constraints ? Object.assign({}, constraints) : { audio: true, video: false };
      if (next.audio === false) return origGum(next);
      var audio =
        typeof next.audio === "object" && next.audio
          ? Object.assign({}, next.audio)
          : {};
      if (audio.echoCancellation !== false) audio.echoCancellation = true;
      if (audio.noiseSuppression !== false) audio.noiseSuppression = true;
      if (audio.autoGainControl !== false) audio.autoGainControl = true;
      // Prefer the default / communications profile when available (Windows).
      if (!audio.deviceId && !audio.groupId) {
        try {
          audio.googEchoCancellation = true;
          audio.googNoiseSuppression = true;
          audio.googAutoGainControl = true;
        } catch (e) {}
      }
      next.audio = audio;
      return origGum(next);
    };
  }

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
    var added = typeof result === "number" ? result : (result.added || 0);
    var updated = result && result.updated ? result.updated : 0;
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
      updated: updated,
      cart_count: SH.cart().length,
      written: flash,
      paid: false,
      placed: false,
      message: updated && !added
        ? "Cart already had those items — updated them, did NOT duplicate. Drawer opened. Do not add again when repeating the order."
        : "Items staged into the guest cart. Drawer opened. Guest reviews and pays themselves. Do not claim paid or sent. Do not call this again just to repeat the ticket."
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
    // Soften turn / mic on desktop so speaker bleed is less likely to trip VAD.
    if (DESKTOP) {
      var overrides = config.overrides || (config.overrides = {});
      var conv = overrides.conversationConfigOverride || (overrides.conversationConfigOverride = {});
      var turn = conv.turn || (conv.turn = {});
      turn.turnEagerness = "patient";
      var vad = conv.vad || (conv.vad = {});
      vad.backgroundVoiceDetection = true;
    }
  }

  window.addEventListener("elevenlabs-convai:call", wireCall);

  function softDuckOrb(el) {
    if (!DESKTOP || !el) return;
    // Lower widget gain a bit so PC speakers don't scream into the mic.
    try {
      el.style.setProperty("--el-volume", "0.72");
    } catch (e) {}
    el.addEventListener("elevenlabs-convai:mode", function (ev) {
      var mode = (ev.detail && (ev.detail.mode || ev.detail)) || "";
      var speaking = String(mode).toLowerCase().indexOf("speak") !== -1;
      document.documentElement.classList.toggle("sh-voice-speaking", speaking);
    });
  }

  function mountWidget() {
    if (document.querySelector("elevenlabs-convai")) return;
    var el = document.createElement("elevenlabs-convai");
    el.setAttribute("agent-id", AGENT_ID);
    el.setAttribute("variant", "compact");
    el.setAttribute("action-text", "Order with Snack AI");
    el.setAttribute("avatar-image-url", "assets/logo-circle-512.png");
    el.className = "sh-voice-orb";
    el.addEventListener("elevenlabs-convai:call", wireCall);
    softDuckOrb(el);
    document.body.appendChild(el);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountWidget);
  } else {
    mountWidget();
  }
})();
