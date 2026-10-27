/* The house answers from the written menu. It does not invent a price, an hour, or an allergy. */
(function () {
  var STOP = {
    que: 1, cual: 1, cuales: 1, como: 1, cuanto: 1, cuantos: 1, donde: 1,
    el: 1, la: 1, los: 1, las: 1, un: 1, una: 1, de: 1, del: 1, al: 1, con: 1,
    por: 1, para: 1, y: 1, o: 1, en: 1, es: 1, son: 1, hay: 1, tiene: 1, tienen: 1,
    lleva: 1, llevan: 1, the: 1, a: 1, an: 1, what: 1, whats: 1, how: 1, much: 1,
    does: 1, do: 1, is: 1, are: 1, with: 1, of: 1, in: 1, on: 1, to: 1, for: 1,
    les: 1, des: 1, du: 1, qui: 1, quoi: 1, est: 1, une: 1, dans: 1, avec: 1
  };

  function code() {
    try {
      if (window.L && L.lang) return L.lang();
    } catch (e) {}
    return "es";
  }

  function say(es, en, fr) {
    var c = code();
    if (c === "en") return en;
    if (c === "fr") return fr;
    return es;
  }

  function words(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  }

  function has(text, word) {
    return (" " + words(text) + " ").indexOf(" " + word + " ") !== -1;
  }

  function hits(text, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (has(text, list[i])) return true;
    }
    return false;
  }

  function phone() {
    return (window.SH && SH.HOUSE && SH.HOUSE.phonePretty) || "786.290.5242";
  }

  function blob(item) {
    return words([item.name, item.en, item.fr, item.note, item.about, item.aboutEn, item.aboutFr, item.mark, item.id].join(" "));
  }

  function itemName(item) {
    if (code() === "en") return item.en || item.name;
    if (code() === "fr") return item.fr || item.en || item.name;
    return item.name;
  }

  function itemAbout(item) {
    if (code() === "en") return item.aboutEn || item.note || "";
    if (code() === "fr") return item.aboutFr || item.aboutEn || item.note || "";
    return item.about || item.note || "";
  }

  function meat(item) {
    var t = blob(item);
    return {
      cerdo: hits(t, ["lechon", "puerco", "jamon", "tocino", "bacon", "jambon"]),
      res: hits(t, ["bistec", "carne", "steak"]),
      pollo: hits(t, ["pollo", "chicken", "poulet"]),
      atun: hits(t, ["atun", "tuna", "thon"])
    };
  }

  function dairy(item) {
    return hits(blob(item), ["queso", "leche", "mantequilla", "evaporad", "fromage", "lait", "cheese", "milk", "butter", "beurre", "cream"]);
  }

  function egg(item) {
    return hits(blob(item), ["huevo", "huevos", "omelet", "omelette", "oeuf", "oeufs"]);
  }

  function anyMeat(item) {
    var m = meat(item);
    return m.cerdo || m.res || m.pollo || m.atun;
  }

  function callLine() {
    return say(
      "Si la alergia es fuerte, confirma al " + phone() + ".",
      "If the allergy is serious, confirm at " + phone() + ".",
      "Si l'allergie est sérieuse, confirme au " + phone() + "."
    );
  }

  function itemCard(item) {
    var name = itemName(item);
    var price = SH.money(item.cents);
    var line = say(name + " sale a " + price + ".", name + " is " + price + ".", name + " est à " + price + ".");
    var about = itemAbout(item);
    if (about) line += " " + about;
    if (item.extra) {
      line += " " + say(
        "Si le sumas aguacate, tomate, queso o lechuga, son $2.50.",
        "Add avocado, tomato, cheese or lettuce for $2.50.",
        "Avocat, tomate, fromage ou laitue en plus : 2,50 $."
      );
    }
    return line;
  }

  function listNames(items) {
    return items.map(itemName).join(", ");
  }

  function shortName(item) {
    return itemName(item).replace(/^Jugo de /i, "").replace(/^Jus de /i, "").replace(/^Jus d'/i, "");
  }

  function spoken(items) {
    var names = items.map(shortName);
    if (names.length <= 6) return names.join(", ");
    return names.slice(0, 5).join(", ") + say(" y otros en la carta", " and others on the menu", " et d'autres sur la carte");
  }

  function optionalAdd(item) {
    var t = blob(item);
    var name = words(item.name + " " + (item.en || "") + " " + (item.fr || ""));
    var added = t.indexOf("sumar") !== -1 || t.indexOf("can be added") !== -1 || t.indexOf("ajouter") !== -1;
    return added && !hits(name, ["lechon", "jamon", "puerco", "tocino", "bacon", "jambon", "porc"]);
  }

  function allergenList(items, kind) {
    var found = items.filter(function (item) {
      var m = meat(item);
      if (kind === "cerdo") return m.cerdo;
      if (kind === "res") return m.res;
      if (kind === "pollo") return m.pollo;
      if (kind === "atun") return m.atun;
      if (kind === "lacteo") return dairy(item);
      if (kind === "huevo") return egg(item);
      return false;
    });
    if (!found.length) {
      return say(
        "En lo escrito no aparece. " + callLine(),
        "It is not in the written menu. " + callLine(),
        "Ce n'est pas écrit dans la carte. " + callLine()
      );
    }
    var extra = kind === "cerdo" ? found.filter(optionalAdd) : [];
    found = found.filter(function (item) { return extra.indexOf(item) === -1; });
    if (!found.length) {
      return say(
        "En la carta no lo veo nombrado. " + callLine(),
        "I don't see it named on the menu. " + callLine(),
        "Je ne le vois pas nommé sur la carte. " + callLine()
      );
    }
    var lead = {
      cerdo: say("Llevan cerdo, jamón o tocino: ", "These have pork, ham or bacon: ", "Il y a du porc, du jambon ou du bacon : "),
      res: say("Llevan carne: ", "These have beef: ", "Il y a de la viande : "),
      pollo: say("Llevan pollo: ", "These have chicken: ", "Il y a du poulet : "),
      atun: say("Llevan atún: ", "These have tuna: ", "Il y a du thon : "),
      lacteo: say("Llevan leche o queso: ", "These have milk or cheese: ", "Il y a du lait ou du fromage : "),
      huevo: say("Llevan huevo: ", "These have egg: ", "Il y a de l'œuf : ")
    }[kind];
    var line = lead + spoken(found) + ".";
    if (extra.length) {
      var extraNames = extra.map(itemName);
      var extraLine = extraNames.length === 1
        ? extraNames[0]
        : extraNames.slice(0, -1).join(", ") + " y al " + extraNames[extraNames.length - 1];
      line += " " + say(
        "Al " + extraLine + " se les puede sumar jamón.",
        "Ham can be added to " + listNames(extra) + ".",
        "On peut ajouter du jambon à " + listNames(extra) + "."
      );
    }
    return line + " " + callLine();
  }

  function itemFlag(item, kind, q) {
    var m = meat(item);
    var on = kind === "cerdo" ? m.cerdo : kind === "res" ? m.res : kind === "pollo" ? m.pollo : kind === "atun" ? m.atun : kind === "lacteo" ? dairy(item) : egg(item);
    var name = itemName(item);
    var bit = on
      ? say(name + " sí lo lleva.", name + " does include it.", name + " en contient.")
      : say(name + " no lo nombra.", name + " doesn't name it.", name + " ne le nomme pas.");
    var about = itemAbout(item);
    if (about) bit += " " + about;
    if (q && q.indexOf("sin") !== -1 && q.indexOf("alerg") === -1) {
      return on
        ? say(name + " sí lo lleva. Si lo quieres sin eso, dilo al pedir.", name + " does include it. Say so if you want it left out.", name + " en contient. Dis-le si tu le veux sans.")
        : say(name + " no lo lleva.", name + " doesn't include it.", name + " ne l'a pas.");
    }
    return bit + " " + callLine();
  }

  function gluten() {
    return say(
      "Llevan pan, hojaldre o masa frita los sándwiches, los pastelitos, los tequeños, las croquetas, las empanadas, los churros, el pan de bono y las tostadas. Los tacos llevan tortilla y aquí no dice si es de maíz o de harina. No hay lista de sin gluten.\n" + callLine(),
      "Sandwiches, pastries, tequeños, croquettes, empanadas, churros, pan de bono and toast use bread, puff pastry or fried dough. Tacos use a tortilla and the menu does not say if it is corn or flour. There is no gluten-free list.\n" + callLine(),
      "Les sandwichs, pastelitos, tequeños, croquettes, empanadas, churros, pan de bono et toasts ont du pain, de la pâte feuilletée ou de la pâte frite. Les tacos ont une tortilla et la carte ne dit pas si elle est de maïs ou de blé. Il n'y a pas de liste sans gluten.\n" + callLine()
    );
  }

  function nuts() {
    return say(
      "En lo escrito no aparece nuez, maní ni almendra. No es una garantía.\n" + callLine(),
      "Nuts, peanuts and almonds are not written on the menu. That is not a guarantee.\n" + callLine(),
      "Noix, cacahuète et amande ne sont pas écrites sur la carte. Ce n'est pas une garantie.\n" + callLine()
    );
  }

  function shellfish() {
    return say(
      "En lo escrito no aparece marisco. No es una garantía.\n" + callLine(),
      "Shellfish is not written on the menu. That is not a guarantee.\n" + callLine(),
      "Les fruits de mer ne sont pas écrits sur la carte. Ce n'est pas une garantie.\n" + callLine()
    );
  }

  function plants(items, vegan) {
    var plain = items.filter(function (item) {
      if (anyMeat(item) || dairy(item) || egg(item)) return false;
      if (item.id === "cappuccino" || item.id === "cappuccino-gr" || item.id === "chocolate" || item.id === "chocolate-gr") return false;
      return item.group === "jugos" || item.group === "calientes" || item.id === "agua" || item.id === "coco" || item.id.indexOf("bot-") === 0;
    });
    var base = say(
      "En lo escrito no nombran carne, leche ni huevo: " + listNames(plain) + ".",
      "The written text names no meat, milk or egg: " + listNames(plain) + ".",
      "Le texte ne nomme ni viande, ni lait, ni œuf : " + listNames(plain) + "."
    );
    if (vegan) {
      return base + "\n" + say(
        "No es un menú vegano certificado.",
        "This is not a certified vegan menu.",
        "Ce n'est pas un menu vegan certifié."
      ) + "\n" + callLine();
    }
    return base + "\n" + say(
      "Sin carne, pero con queso: la ensalada de vegetales. Huevos, tostadas y varios pastelitos tampoco llevan carne, y sí llevan huevo o lácteo. No es un menú vegetariano certificado.",
      "No meat, but with cheese: the vegetable salad. Eggs, toast and some pastries also have no meat, and they do have egg or dairy. This is not a certified vegetarian menu.",
      "Sans viande, mais avec du fromage : la salade de légumes. Œufs, toasts et certains pastelitos n'ont pas de viande non plus, et ils ont de l'œuf ou du laitier. Ce n'est pas un menu végétarien certifié."
    ) + "\n" + callLine();
  }

  function where() {
    var h = SH.HOUSE;
    return say(
      h.name + " está en " + h.address + ", " + h.city + ". Teléfono " + h.phonePretty + ".",
      h.name + " is at " + h.address + ", " + h.city + ". Phone " + h.phonePretty + ".",
      h.name + " est au " + h.address + ", " + h.city + ". Téléphone " + h.phonePretty + "."
    );
  }

  function hours() {
    return say(
      "El horario cambia. Llama al " + phone() + " antes de venir.",
      "Hours change. Call " + phone() + " before you come.",
      "L'horaire change. Appelle le " + phone() + " avant de venir."
    );
  }

  function delivery() {
    var cfg = SH.settings();
    var fee = SH.money(cfg.fee);
    if (!cfg.delivery) {
      return say(
        "El carrito está parado. Se recoge en el mostrador, " + SH.HOUSE.address + ".",
        "The cart is paused. Pick up at the counter, " + SH.HOUSE.address + ".",
        "Le chariot est à l'arrêt. On retire au comptoir, " + SH.HOUSE.address + "."
      );
    }
    return say(
      "Dentro de tres millas sale el carrito de golf. Más lejos, se recoge en el mostrador. El carrito suma " + fee + ". La cocina cuenta unos " + SH.HOUSE.prepMin + " minutos, y el viaje se suma encima.",
      "Inside three miles the golf cart goes out. Farther than that, you pick up at the counter. The cart adds " + fee + ". The kitchen counts about " + SH.HOUSE.prepMin + " minutes, plus the ride.",
      "Dans les trois milles, le chariot de golf sort. Plus loin, on retire au comptoir. Le chariot ajoute " + fee + ". La cuisine compte environ " + SH.HOUSE.prepMin + " minutes, plus le trajet."
    );
  }

  function pay() {
    var cfg = SH.settings();
    var zelle = cfg.zelle
      ? say("Zelle: " + cfg.zelle + ".", "Zelle: " + cfg.zelle + ".", "Zelle : " + cfg.zelle + ".")
      : say("El Zelle te lo confirma la casa.", "The house confirms the Zelle.", "La maison confirme le Zelle.");
    return say(
      "En la cesta se paga en efectivo al llegar, con tarjeta en el lector, por Zelle, o en el mostrador al recoger. " + zelle,
      "In the basket you pay cash on arrival, card on the reader, Zelle, or at the counter when you pick up. " + zelle,
      "Dans le panier : espèces à l'arrivée, carte sur le lecteur, Zelle, ou au comptoir au retrait. " + zelle
    );
  }

  function extras() {
    return say(
      "En los sándwiches que lo permiten, aguacate, tomate, queso o lechuga de más suma $2.50. El queso es suizo, americano o pepper jack. En los jugos, una fruta de más suma $3.",
      "On the sandwiches that allow it, extra avocado, tomato, cheese or lettuce is $2.50. Cheese is Swiss, American or pepper jack. On the juices, an extra fruit is $3.",
      "Sur les sandwichs qui le permettent, avocat, tomate, fromage ou laitue en plus : 2,50 $. Le fromage est suisse, américain ou pepper jack. Sur les jus, un fruit de plus : 3 $."
    );
  }

  function tax() {
    var pct = Math.round(SH.settings().tax * 1000) / 10;
    return say(
      "Al pedir, el tax de la caja es " + pct + "%.",
      "At checkout, the tax on the register is " + pct + "%.",
      "À la caisse, la taxe est de " + pct + " %."
    );
  }

  function firmas(items) {
    var found = items.filter(function (item) { return item.mark === "Firma"; });
    var price = found.length ? SH.money(found[0].cents) : "";
    return say(
      "La firma es " + listNames(found) + (price ? ", a " + price : "") + ".",
      "The house signatures are " + listNames(found) + (price ? ", at " + price : "") + ".",
      "La signature, c'est " + listNames(found) + (price ? ", à " + price : "") + "."
    );
  }

  function groupList(group, items) {
    var rows = items.filter(function (item) { return item.group === group.id; });
    var title = code() === "en" ? group.en : code() === "fr" ? group.fr : group.name;
    var rule = code() === "en" ? group.ruleEn : code() === "fr" ? group.ruleFr : group.rule;
    var cents = rows.map(function (item) { return item.cents; });
    var min = Math.min.apply(null, cents);
    var max = Math.max.apply(null, cents);
    var shown = spoken(rows);
    if (min === max && rule) return title + ": " + shown + ". " + rule;
    var range = min === max
      ? say("Todos salen a " + SH.money(min) + ".", "All of them are " + SH.money(min) + ".", "Tous à " + SH.money(min) + ".")
      : say("Van de " + SH.money(min) + " a " + SH.money(max) + ".", "They run from " + SH.money(min) + " to " + SH.money(max) + ".", "De " + SH.money(min) + " à " + SH.money(max) + ".");
    var line = title + ": " + shown + ". " + range;
    if (rule) line += " " + rule;
    else line += " " + say("Dime cuál y te cuento qué lleva.", "Tell me which one and I'll say what's in it.", "Dis-moi lequel et je te dis ce qu'il contient.");
    return line;
  }

  function greet() {
    return say(
      "Dime. El cubano, un cafecito, si el carrito llega, o qué lleva algo.",
      "Tell me. The Cuban, a cafecito, whether the cart can reach you, or what's in something.",
      "Dis-moi. Le cubain, un cafecito, si le chariot arrive, ou ce que contient un plat."
    );
  }

  function unknown() {
    return say(
      "Eso no lo tengo en la carta. Si es un cambio o una alergia, llama al " + phone() + " y te dicen.",
      "That's not on the menu. For a change or an allergy, call " + phone() + " and they'll tell you.",
      "Ce n'est pas sur la carte. Pour un changement ou une allergie, appelle le " + phone() + "."
    );
  }

  var last = { item: null, group: null };

  var ALIAS = {
    prensado: "cubano", cuban: "cubano", cubnao: "cubano",
    burger: "frita", hamburguesa: "frita",
    espresso: "colada", expreso: "colada",
    juguito: "jugo", juguitos: "jugo",
    sanduche: "sandwich", bocadillo: "sandwich", bocata: "sandwich",
    midnight: "media noche", medianoche: "media noche",
    papitas: "papas", fries: "papas",
    cortao: "cortadito"
  };

  function expand(q) {
    return q.split(" ").map(function (tok) { return ALIAS[tok] || tok; }).join(" ");
  }

  function near(a, b) {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > 1 || a.length < 5) return false;
    var i = 0;
    var j = 0;
    var slips = 0;
    while (i < a.length && j < b.length) {
      if (a.charAt(i) === b.charAt(j)) { i++; j++; continue; }
      slips++;
      if (slips > 1) return false;
      if (a.length === b.length) { i++; j++; }
      else if (a.length > b.length) i++;
      else j++;
    }
    return true;
  }

  function byId(items, id) {
    var i;
    for (i = 0; i < items.length; i++) if (items[i].id === id) return items[i];
    return null;
  }

  function addonCents(item, q) {
    if (item.group === "jugos" && hits(q, ["fruta", "fruit"])) return 300;
    if (!item.extra || hits(q, ["sin", "without", "sans"])) return 0;
    var n = 0;
    if (hits(q, ["aguacate", "avocado", "avocat"])) n++;
    if (hits(q, ["tomate", "tomato"])) n++;
    if (hits(q, ["queso", "cheese", "fromage"])) n++;
    if (hits(q, ["lechuga", "lettuce", "laitue"])) n++;
    return n * 250;
  }

  function priceOf(item, q) {
    return say(
      itemName(item) + " sale a " + SH.money(item.cents + addonCents(item, q)) + ".",
      itemName(item) + " is " + SH.money(item.cents + addonCents(item, q)) + ".",
      itemName(item) + " est à " + SH.money(item.cents + addonCents(item, q)) + "."
    );
  }

  function pairWith(item, items) {
    var mate = null;
    if (item.group === "sandwiches" || item.group === "ensaladas") mate = byId(items, "cafecito");
    else if (item.group === "calientes" || item.group === "picar") mate = byId(items, "pas-guayaba");
    else if (item.group === "jugos") mate = byId(items, "croissant");
    else if (item.group === "desayuno") mate = byId(items, "cafecito");
    else mate = byId(items, "cafecito");
    if (!mate || mate.id === item.id) return "";
    return say(
      " Con eso cae bien " + itemName(mate) + ", a " + SH.money(mate.cents) + ".",
      " " + itemName(mate) + " goes with it, at " + SH.money(mate.cents) + ".",
      " " + itemName(mate) + " va bien avec, à " + SH.money(mate.cents) + "."
    );
  }

  function orderHow() {
    return say(
      "Abre la cesta, añade lo que quieras y, si el plato lo permite, marca el adicional. Cada uno se arma aparte: el segundo cubano no hereda el gusto del primero. El carrito sale dentro de tres millas; más lejos se recoge en el mostrador.",
      "Open the basket, add what you want and, if the dish allows it, mark the extra. Each one is built on its own: a second Cuban does not keep the first one's notes. The cart goes out inside three miles; farther than that, you pick up at the counter.",
      "Ouvre le panier, ajoute ce que tu veux et, si le plat le permet, coche le supplément. Chacun se monte à part : un second cubain ne garde pas le goût du premier. Le chariot sort dans les trois milles ; plus loin, on retire au comptoir."
    );
  }

  function meal(items, q) {
    var cafe = byId(items, "cafecito");
    var toast = byId(items, "tostada");
    var eggs = byId(items, "revueltos");
    var cubano = byId(items, "cubano");
    var pastry = byId(items, "pas-guayaba");
    var bite = byId(items, "croqueta");
    if (q.indexOf("desayun") !== -1 || q.indexOf("breakfast") !== -1 || q.indexOf("petit") !== -1) {
      return say(
        "Para empezar: " + itemName(eggs) + " a " + SH.money(eggs.cents) + ", " + itemName(toast) + " a " + SH.money(toast.cents) + " y un " + itemName(cafe) + " a " + SH.money(cafe.cents) + ".",
        "To start: " + itemName(eggs) + " at " + SH.money(eggs.cents) + ", " + itemName(toast) + " at " + SH.money(toast.cents) + " and a " + itemName(cafe) + " at " + SH.money(cafe.cents) + ".",
        "Pour commencer : " + itemName(eggs) + " à " + SH.money(eggs.cents) + ", " + itemName(toast) + " à " + SH.money(toast.cents) + " et un " + itemName(cafe) + " à " + SH.money(cafe.cents) + "."
      );
    }
    if (hits(q, ["ligero", "light", "merienda", "poco", "snack", "leger"])) {
      return say(
        "Algo corto: " + itemName(pastry) + " a " + SH.money(pastry.cents) + ", la " + itemName(bite) + " a " + SH.money(bite.cents) + " y un " + itemName(cafe) + " a " + SH.money(cafe.cents) + ".",
        "Something small: " + itemName(pastry) + " at " + SH.money(pastry.cents) + ", a " + itemName(bite) + " at " + SH.money(bite.cents) + " and a " + itemName(cafe) + " at " + SH.money(cafe.cents) + ".",
        "Un petit creux : " + itemName(pastry) + " à " + SH.money(pastry.cents) + ", la " + itemName(bite) + " à " + SH.money(bite.cents) + " et un " + itemName(cafe) + " à " + SH.money(cafe.cents) + "."
      );
    }
    if (hits(q, ["dos", "two", "deux", "compart"])) {
      return say(
        "Para dos, dos cubanos salen a " + SH.money(cubano.cents * 2) + ". Si uno quiere otra cosa, la media noche y el bistec están al mismo precio.",
        "For two, two Cubans are " + SH.money(cubano.cents * 2) + ". If one person wants something else, the midnight and the steak are the same price.",
        "Pour deux, deux cubains font " + SH.money(cubano.cents * 2) + ". Si l'un veut autre chose, la medianoche et le steak sont au même prix."
      );
    }
    return say(
      "Si tienes hambre, el cubano a " + SH.money(cubano.cents) + " y un " + itemName(cafe) + " a " + SH.money(cafe.cents) + ". Juntos, " + SH.money(cubano.cents + cafe.cents) + ".",
      "If you're hungry, the Cuban at " + SH.money(cubano.cents) + " and a " + itemName(cafe) + " at " + SH.money(cafe.cents) + ". Together, " + SH.money(cubano.cents + cafe.cents) + ".",
      "Si tu as faim, le cubain à " + SH.money(cubano.cents) + " et un " + itemName(cafe) + " à " + SH.money(cafe.cents) + ". Ensemble, " + SH.money(cubano.cents + cafe.cents) + "."
    );
  }

  function avoidMeat(items, flag) {
    if (flag === "cerdo") {
      var clear = ["atun", "pan-tomate", "tortilla-pan", "ens-veg"].map(function (id) { return byId(items, id); }).filter(Boolean);
      return say(
        "Sin cerdo en lo escrito: " + listNames(clear) + ". El bistec y el de pollo no lo traen de base; el jamón se pide aparte. " + callLine(),
        "No pork in the written text: " + listNames(clear) + ". The steak and the chicken don't come with it; ham is added only if you ask. " + callLine(),
        "Pas de porc dans le texte : " + listNames(clear) + ". Le steak et le poulet n'en ont pas à la base ; le jambon se demande à part. " + callLine()
      );
    }
    var ok = items.filter(function (item) {
      var m = meat(item);
      if (flag === "pollo") return !m.pollo && item.group === "sandwiches";
      if (flag === "res") return !m.res && item.group === "sandwiches";
      return false;
    }).slice(0, 4);
    if (!ok.length) return allergenList(items, flag);
    return say(
      "Sin eso, mira " + listNames(ok) + ". " + callLine(),
      "Without that, look at " + listNames(ok) + ". " + callLine(),
      "Sans ça, regarde " + listNames(ok) + ". " + callLine()
    );
  }

  var FLAG_WORD = {
    pork: 1, cerdo: 1, puerco: 1, jamon: 1, lechon: 1, porc: 1, jambon: 1, bacon: 1, tocino: 1,
    pollo: 1, chicken: 1, poulet: 1, atun: 1, tuna: 1, thon: 1, pescado: 1, fish: 1, poisson: 1,
    beef: 1, steak: 1, bistec: 1, boeuf: 1, carne: 1, leche: 1, queso: 1, dairy: 1, cheese: 1,
    milk: 1, fromage: 1, lait: 1, huevo: 1, egg: 1, oeuf: 1, gluten: 1
  };

  function onlyFlag(item, q) {
    var name = words([item.name, item.en, item.fr].join(" "));
    var toks = q.split(" ").filter(function (tok) { return tok.length > 2 && !STOP[tok]; });
    var named = toks.filter(function (tok) { return name.indexOf(tok) !== -1; });
    return named.length > 0 && named.every(function (tok) { return FLAG_WORD[tok]; });
  }

  function namesItem(item, q) {
    var name = words([item.name, item.en, item.fr, item.id.replace(/-/g, " ")].join(" "));
    return name.split(" ").some(function (tok) {
      return tok.length > 3 && !FLAG_WORD[tok] && (" " + q + " ").indexOf(" " + tok + " ") !== -1;
    });
  }

  function score(item, q) {
    var name = words([item.name, item.en, item.fr, item.id.replace(/-/g, " ")].join(" "));
    var about = blob(item);
    var s = 0;
    var toks = q.split(" ").filter(function (tok) { return tok.length > 2 && !STOP[tok]; });
    if (q.length > 3 && name.indexOf(q) !== -1) s += 8;
    var nameToks = name.split(" ");
    toks.forEach(function (tok) {
      var whole = (" " + name + " ").indexOf(" " + tok + " ") !== -1;
      if (whole) s += 6;
      else if (nameToks.some(function (part) { return near(tok, part); })) s += 5;
      else if (name.indexOf(tok) !== -1) s += 2;
      else if (about.indexOf(tok) !== -1) s += 1;
    });
    return s;
  }

  function flagOf(q) {
    if (hits(q, ["gluten", "trigo", "wheat", "ble", "celiaco"])) return "gluten";
    if (hits(q, ["nuez", "nueces", "mani", "peanut", "almendra", "nut", "noix", "cacahuete"])) return "nuez";
    if (hits(q, ["marisco", "camaron", "shellfish", "crustace"])) return "marisco";
    if (hits(q, ["vegano", "vegan"])) return "vegano";
    if (hits(q, ["vegetar", "vegetarien", "vegetarian"])) return "vegetar";
    if (hits(q, ["cerdo", "puerco", "pork", "jamon", "lechon", "porc", "jambon"])) return "cerdo";
    if (hits(q, ["lacteo", "lactosa", "leche", "queso", "dairy", "lactose", "lait", "fromage"])) return "lacteo";
    if (hits(q, ["huevo", "egg", "oeuf"])) return "huevo";
    if (hits(q, ["atun", "tuna", "thon", "pescado", "fish", "poisson"])) return "atun";
    if (hits(q, ["pollo", "chicken", "poulet"])) return "pollo";
    if (hits(q, ["res", "bistec", "beef", "steak", "boeuf"])) return "res";
    return "";
  }

  function reply(raw) {
    if (!window.SH) return "";
    var q = expand(words(raw));
    if (!q) return greet();
    var toks = q.split(" ");
    if (toks.length < 3 && hits(q, ["hola", "buenas", "buenos", "hello", "hi", "hey", "bonjour", "salut"])) return greet();
    if (hits(q, ["gracias", "thanks", "merci"])) {
      return say("Cuando quieras.", "Anytime.", "Quand tu veux.");
    }

    var items = SH.menu();
    var ranked = items.map(function (item) {
      return { item: item, s: score(item, q) };
    }).sort(function (a, b) { return b.s - a.s; });
    var best = ranked[0];
    var strong = best && best.s >= 4;

    if (hits(q, ["horario", "hora", "abierto", "cierran", "abren", "hours", "open", "horaire", "ouvert"])) return hours();
    if (!strong && hits(q, ["donde", "direccion", "address", "ubicad", "mapa", "where", "adresse"])) return where();
    if (!strong && hits(q, ["telefono", "llama", "numero", "phone", "call", "telephone"])) return where();
    if (!strong && hits(q, ["pago", "pagar", "zelle", "efectivo", "tarjeta", "cash", "card", "payer", "paiement"])) return pay();
    if (!strong && hits(q, ["entrega", "delivery", "deliver", "carrito", "milla", "mile", "llegan", "domicilio", "livraison", "livrez", "livre", "chariot"])) return delivery();
    if (hits(q, ["tax", "impuesto", "taxes", "taxe"])) return tax();
    if (!strong && hits(q, ["adicional", "extra", "aguacate", "avocado", "avocat"])) return extras();
    if (hits(q, ["firma", "signature"])) return firmas(items);
    if (hits(q, ["tarda", "demora", "espera", "listo", "long", "wait", "attente"])) return delivery();
    if (!strong && (q.indexOf("como pido") !== -1 || q.indexOf("como pedir") !== -1 || q.indexOf("how to order") !== -1 || q.indexOf("comment commander") !== -1)) return orderHow();
    if (!strong && (q.indexOf("desayun") !== -1 || q.indexOf("breakfast") !== -1 || q.indexOf("merienda") !== -1 || q.indexOf("hambre") !== -1 || q.indexOf("ligero") !== -1 || q.indexOf("para dos") !== -1 || q.indexOf("for two") !== -1 || q.indexOf("pour deux") !== -1)) return meal(items, q);

    if (last.group && (q.indexOf("y ") === 0 || q.indexOf("el de") !== -1 || q.indexOf("la de") !== -1 || q.indexOf("los de") !== -1)) {
      var local = items.filter(function (item) { return item.group === last.group; }).map(function (item) {
        return { item: item, s: score(item, q) };
      }).sort(function (a, b) { return b.s - a.s; });
      if (local[0] && local[0].s >= 4) {
        ranked = local;
        best = local[0];
        strong = true;
      }
    }

    var flag = flagOf(q);
    var pointing = last.item && (hits(q, ["ese", "esa", "eso", "mismo", "misma", "that", "celui", "celle"]) || (hits(q, ["sin"]) && (!strong || onlyFlag(best.item, q))) || (!strong && hits(q, ["precio", "cuesta", "cuanto", "lleva", "tiene", "aguacate", "fruta"])));
    if (pointing) {
      if ((hits(q, ["precio", "cuesta", "cuanto"]) || addonCents(last.item, q)) && !hits(q, ["lleva", "tiene", "sin", "alerg"])) {
        return priceOf(last.item, q);
      }
      if (flag && flag !== "gluten" && flag !== "nuez" && flag !== "marisco" && flag !== "vegano" && flag !== "vegetar") {
        return itemFlag(last.item, flag, q);
      }
      return itemCard(last.item);
    }

    if (flag === "gluten") return gluten();
    if (flag === "nuez") return nuts();
    if (flag === "marisco") return shellfish();
    if (flag === "vegano") return plants(items, true);
    if (flag === "vegetar") return plants(items, false);

    var named = strong && namesItem(best.item, q);
    var allergy = q.indexOf("alerg") !== -1 || q.indexOf("allerg") !== -1;
    if (flag && !named && !allergy && (q.indexOf("no como") !== -1 || q.indexOf("dont eat") !== -1 || hits(q, ["sin"]))) {
      if (flag === "cerdo" || flag === "pollo" || flag === "res") return avoidMeat(items, flag);
    }
    if (flag && named && (allergy || hits(q, ["tiene", "lleva", "have", "contain", "contien", "sin"]))) {
      last.item = best.item;
      return itemFlag(best.item, flag, q);
    }
    if (flag && (allergy || !strong)) return allergenList(items, flag);

    var tops = ranked.filter(function (row) { return row.s >= 4; });
    if (tops.length >= 2 && hits(q, ["o", "or", "vs"])) {
      var a = tops[0].item;
      var b = tops[1].item;
      var low = a.cents <= b.cents ? a : b;
      last.item = low;
      var same = a.cents === b.cents;
      var closer = same
        ? say("Salen igual.", "Same price.", "Même prix.")
        : say(itemName(low) + " es el más bajo.", itemName(low) + " is the lower one.", itemName(low) + " est le moins cher.");
      return say(
        itemName(a) + " sale a " + SH.money(a.cents) + " y " + itemName(b) + " a " + SH.money(b.cents) + ". " + closer,
        itemName(a) + " is " + SH.money(a.cents) + " and " + itemName(b) + " is " + SH.money(b.cents) + ". " + closer,
        itemName(a) + " est à " + SH.money(a.cents) + " et " + itemName(b) + " à " + SH.money(b.cents) + ". " + closer
      );
    }

    var group = null;
    SH.GROUPS.forEach(function (g) {
      [g.id, g.name, g.en, g.fr].forEach(function (label) {
        var name = words(label);
        if (!name) return;
        if (q.indexOf(name) !== -1) group = g;
        toks.forEach(function (tok) {
          if (tok.length >= 3 && (name.indexOf(tok) === 0 || tok.indexOf(name) === 0)) group = g;
        });
      });
    });
    if (group && (!strong || best.s < 6)) {
      last.group = group.id;
      return groupList(group, items);
    }
    if (strong) {
      var tied = ranked.filter(function (row) { return row.s === best.s && row.s >= 6; });
      if (tied.length > 1 && !hits(q, ["o", "or", "vs", "diferencia"])) {
        last.group = tied[0].item.group;
        return say(
          "Hay varios: " + spoken(tied.map(function (row) { return row.item; })) + ". Dime cuál.",
          "There are a few: " + spoken(tied.map(function (row) { return row.item; })) + ". Tell me which.",
          "Il y en a plusieurs : " + spoken(tied.map(function (row) { return row.item; })) + ". Dis-moi lequel."
        );
      }
      last.item = best.item;
      last.group = best.item.group;
      if (q.indexOf("acompa") !== -1 || q.indexOf("va bien") !== -1 || q.indexOf("con que") !== -1 || q.indexOf("avec quoi") !== -1 || q.indexOf("with what") !== -1) return priceOf(best.item, q) + pairWith(best.item, items);
      if (addonCents(best.item, q) && !hits(q, ["lleva", "tiene", "sin"])) return priceOf(best.item, q);
      if (hits(q, ["lleva", "tiene", "ingrediente", "que es"]) && !hits(q, ["precio", "cuesta", "cuanto"])) {
        var about = itemAbout(best.item);
        return about
          ? itemName(best.item) + ". " + about
          : say(itemName(best.item) + ". En la carta no detalla el armado.", itemName(best.item) + ". The menu doesn't spell out the build.", itemName(best.item) + ". La carte ne détaille pas la composition.");
      }
      return itemCard(best.item);
    }
    if (q.indexOf("barat") !== -1 || q.indexOf("cheap") !== -1 || q.indexOf("moins cher") !== -1) {
      var sorted = items.slice().sort(function (x, y) { return x.cents - y.cents; });
      var floor = sorted[0].cents;
      var lows = sorted.filter(function (item) { return item.cents === floor; }).slice(0, 3);
      return say(
        "Lo más bajo es " + listNames(lows) + ", a " + SH.money(floor) + ".",
        "The lowest is " + listNames(lows) + ", at " + SH.money(floor) + ".",
        "Le moins cher est " + listNames(lows) + ", à " + SH.money(floor) + "."
      );
    }
    if (q.indexOf("recomiend") !== -1 || q.indexOf("recomend") !== -1 || q.indexOf("sugier") !== -1 || q.indexOf("suggest") !== -1 || hits(q, ["hambre", "pido"])) {
      var cubano = items.filter(function (item) { return item.id === "cubano"; })[0];
      var cafe = items.filter(function (item) { return item.id === "cafecito"; })[0];
      return say(
        "Si no sabes, pide la firma: el cubano, la media noche o el pan con bistec, a " + SH.money(cubano.cents) + ". El cafecito está a " + SH.money(cafe.cents) + ".",
        "If you're not sure, get a signature: the Cuban, the midnight or the steak, at " + SH.money(cubano.cents) + ". A cafecito is " + SH.money(cafe.cents) + ".",
        "Si tu ne sais pas, prends la signature : le cubain, la medianoche ou le steak, à " + SH.money(cubano.cents) + ". Le cafecito est à " + SH.money(cafe.cents) + "."
      );
    }
    return unknown();
  }

  function chips() {
    return say(
      ["Qué lleva el cubano", "Los jugos", "¿Llegan a la casa?", "Alergia al cerdo"],
      ["What's in the Cuban", "The juices", "Do you deliver?", "Pork allergy"],
      ["Dans le cubain", "Les jus", "Vous livrez ?", "Allergie au porc"]
    );
  }

  function paintChrome() {
    var sub = document.getElementById("ask-sub");
    var input = document.getElementById("ask-input");
    var open = document.getElementById("ask-open");
    var close = document.getElementById("ask-x");
    var box = document.getElementById("ask-chips");
    if (sub) sub.textContent = say("De la carta", "From the menu", "De la carte");
    if (input) input.placeholder = say("Un cubano, el carrito, una alergia", "A Cuban, the cart, an allergy", "Un cubain, le chariot, une allergie");
    if (open) open.setAttribute("aria-label", say("Preguntar a la casa", "Ask the house", "Demander à la maison"));
    if (close) close.setAttribute("aria-label", say("Cerrar", "Close", "Fermer"));
    if (!box) return;
    box.innerHTML = "";
    chips().forEach(function (label) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.addEventListener("click", function () { ask(label); });
      box.appendChild(btn);
    });
  }

  function bubble(text, who) {
    var log = document.getElementById("ask-log");
    var p = document.createElement("p");
    p.className = "ask-bubble " + who;
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }

  function ask(text) {
    var clean = String(text || "").trim();
    if (!clean) return;
    bubble(clean, "you");
    bubble(reply(clean), "house");
  }

  function setOpen(on) {
    var panel = document.getElementById("ask-panel");
    var btn = document.getElementById("ask-open");
    if (!panel) return;
    panel.hidden = !on;
    if (btn) btn.setAttribute("aria-expanded", on ? "true" : "false");
    if (on) {
      var log = document.getElementById("ask-log");
      if (log && !log.childNodes.length) bubble(greet(), "house");
      var input = document.getElementById("ask-input");
      if (input) input.focus();
    }
  }

  function mount() {
    var btn = document.getElementById("ask-open");
    var panel = document.getElementById("ask-panel");
    if (!btn || !panel) return;
    paintChrome();
    btn.addEventListener("click", function () { setOpen(panel.hidden); });
    document.getElementById("ask-x").addEventListener("click", function () { setOpen(false); });
    document.getElementById("ask-form").addEventListener("submit", function (event) {
      event.preventDefault();
      var input = document.getElementById("ask-input");
      ask(input.value);
      input.value = "";
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });
    document.addEventListener("sh:lang", paintChrome);
  }

  var api = { reply: reply };
  if (typeof window !== "undefined") window.ASK = api;
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
    else mount();
  }
})();
