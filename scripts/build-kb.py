# -*- coding: utf-8 -*-
import json
import re
import pathlib

root = pathlib.Path(__file__).resolve().parents[1]
src = (root / "js" / "house.js").read_text(encoding="utf-8")


def take(pattern):
    m = re.search(pattern, src, re.S)
    if not m:
        raise SystemExit("miss " + pattern[:60])
    return m.group(1)


def js_to_json(blob):
    blob = re.sub(r"//.*?$", "", blob, flags=re.M)
    blob = re.sub(r"([{,]\s*)([A-Za-z_][\w-]*)\s*:", r'\1"\2":', blob)
    blob = blob.replace("true", "true").replace("false", "false")
    # trailing commas
    blob = re.sub(r",\s*([}\]])", r"\1", blob)
    return json.loads(blob)


MENU = js_to_json(take(r"var MENU = (\[[\s\S]*?\]);\n\n  var GROUPS"))
GROUPS = js_to_json(take(r"var GROUPS = (\[[\s\S]*?\]);\n\n  var ABOUT"))
ABOUT = js_to_json(take(r"var ABOUT = (\{[\s\S]*?\});\n\n  var EXTRAS"))
BUILDS = js_to_json(take(r"var BUILDS = (\{[\s\S]*?\});\n\n  // Extra PARTS"))

lines = [
    "Snack Hunter Cafeteria",
    "Address: 3799 NW 7th St, Miami FL 33126",
    "Phone: 786-290-5242",
    "Golf cart delivery within 3 miles; farther = pickup at counter.",
    "Hours: call first; hours change. Never invent hours.",
    "Payments: cash, card reader on arrival, Zelle (house confirms), counter.",
    "Tax applies. Cart fee when golf-cart delivery.",
    "Paid extras (+$2.50) ONLY when the ingredient is NOT already in that item's default build (parts list).",
    "If lechuga/tomate/queso is already listed in parts for that sandwich, it is INCLUDED — never charge $2.50 for it, never put it in extras.",
    "Example: bistec/pollo already include lechuga+tomate → those are free/included. Cubano has queso in parts → queso included; lechuga/tomate/aguacate can be paid extras on cubano.",
    "Only sandwiches with extras=true accept paid extras. Default build parts can be removed (skip). Never invent prices.",
    "Never invent toppings. Speak ONLY the parts listed for that id. If a topping is not in parts, it is NOT included.",
    "Alias: \"pan con huevo\" / \"egg sandwich\" = id tortilla-pan. Default is ONLY huevo (egg omelet in bread). NO lechuga, NO tomate unless guest pays extras.",
    "",
    "SECTIONS (use navigate_menu_section with these ids when guest asks to see/browse a part of the menu):",
]
ALL_EXTRAS = ["queso", "aguacate", "tomate", "lechuga"]
for g in GROUPS:
    rule = g.get("rule") or ""
    lines.append("- {0} | {1} | EN: {2}{3}".format(g["id"], g["name"], g["en"], (" | " + rule) if rule else ""))
lines.append("- carta | whole menu scroll | EN: Menu")
lines.append("")
lines.append('When guest says "muéstrame desayunos / show me breakfast / jugos / bebidas", call navigate_menu_section immediately so the page scrolls there, then briefly name what is in that section.')
lines.append("When guest names a specific item, call navigate_menu_section with that exact menu id to open/expand the product card.")

lines.append("")
lines.append("MENU (use exact id with open_cart_with_items):")
for item in MENU:
    price = "{:.2f}".format(item["cents"] / 100.0)
    about = (ABOUT.get(item["id"]) or ["", ""])[0]
    build_parts = BUILDS.get(item["id"]) or []
    parts = ", ".join(build_parts)
    bit = "- id={0} | group={1} | {2} | EN: {3} | ${4}".format(
        item["id"], item["group"], item["name"], item["en"], price
    )
    if about:
        bit += " | build: " + about
    if parts:
        bit += " | parts: " + parts
    if item.get("extra"):
        paid = [k for k in ALL_EXTRAS if k not in build_parts]
        if paid:
            bit += " | paid_extras=" + ",".join(paid) + " +2.50"
        else:
            bit += " | paid_extras=none (all listed extras already in parts)"
    lines.append(bit)

lines += [
    "",
    "JUGOS (fresh juices, group=jugos): all $7.00. Extra fruit +$3.",
    "Ids: jugo-pina, jugo-sandia, jugo-maracuya, jugo-mango, jugo-naranja, jugo-nz.",
    "BEBIDAS (bottled drinks, group=bebidas): bot-manzana, bot-guayaba, bot-cranberry, coco, malta-gr, malta-pe, agua, soda, botella-gr, botella-pe, jarritos, gatorade, monster, redbull, perrier.",
    "If asked about jugos or bebidas, answer from this list. Do not say you do not know when the item is listed.",
]

out = root / "assets" / "snack-kb.txt"
text = "\n".join(lines) + "\n"
out.write_text(text, encoding="utf-8")
print(out, "bytes", out.stat().st_size, "items", len(MENU), "lines", len(lines))
