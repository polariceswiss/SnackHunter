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
    "Paid extras on sandwiches with extras=true: queso, aguacate, tomate, lechuga = $2.50 each.",
    "Default build parts can be removed (skip) in the cart. Never invent prices or ingredients.",
    "",
    "SECTIONS:",
]
for g in GROUPS:
    rule = g.get("rule") or ""
    lines.append("- {0} | {1} | EN: {2}{3}".format(g["id"], g["name"], g["en"], (" | " + rule) if rule else ""))

lines.append("")
lines.append("MENU (use exact id with open_cart_with_items):")
for item in MENU:
    price = "{:.2f}".format(item["cents"] / 100.0)
    about = (ABOUT.get(item["id"]) or ["", ""])[0]
    parts = ", ".join(BUILDS.get(item["id"]) or [])
    bit = "- id={0} | group={1} | {2} | EN: {3} | ${4}".format(
        item["id"], item["group"], item["name"], item["en"], price
    )
    if about:
        bit += " | build: " + about
    if parts:
        bit += " | parts: " + parts
    if item.get("extra"):
        bit += " | paid_extras=queso,aguacate,tomate,lechuga +2.50"
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
