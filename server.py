"""Local house server. Static site plus the order ledger.

The public page can leave an order and later ask for that one ticket.
The full book, the price list, and status changes stay behind the house pin.
"""
import hmac
import json
import os
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data", "orders.json")
BOOK = os.path.join(ROOT, "data", "book.json")
LOCK = threading.Lock()
DEFAULT_PIN = "3799"
STATUSES = {"nueva", "plancha", "carrito", "lista", "entregada", "recogida", "cancelada"}
PAYS = {"efectivo", "tarjeta", "zelle", "mostrador"}


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        path = urlparse(self.path).path
        if path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        super().end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        if path == "/api/orders":
            if not self._pin_ok():
                self._json(401, {"error": "clave"})
                return
            with LOCK:
                self._json(200, self._read())
            return
        if path == "/api/book":
            self._json(200, {"prices": self._book().get("prices") or {}, "settings": self._public_settings()})
            return
        prefix = "/api/orders/"
        if path.startswith(prefix):
            oid = path[len(prefix):]
            token = (parse_qs(parsed.query).get("token") or [""])[0]
            with LOCK:
                row = self._find(oid)
            if not row or not token or not hmac.compare_digest(str(row.get("token") or ""), token):
                self._json(404, {"error": "no está"})
                return
            self._json(200, row)
            return
        if path.startswith("/data"):
            self.send_error(404)
            return
        return super().do_GET()

    def do_PUT(self):
        if urlparse(self.path).path != "/api/book":
            self.send_error(404)
            return
        if not self._pin_ok():
            self._json(401, {"error": "clave"})
            return
        book = self._body()
        if not isinstance(book, dict):
            self._json(400, {"error": "mal"})
            return
        clean = {"prices": self._prices(book.get("prices")), "settings": self._settings(book.get("settings"))}
        with LOCK:
            self._write_book(clean)
        self._json(200, {"prices": clean["prices"], "settings": self._public_settings(clean)})

    def do_POST(self):
        if urlparse(self.path).path != "/api/orders":
            self.send_error(404)
            return
        order = self._clean_order(self._body())
        if not order:
            self._json(400, {"error": "pedido incompleto"})
            return
        with LOCK:
            rows = [row for row in self._read() if row.get("id") != order["id"]]
            rows.insert(0, order)
            self._write(rows[:200])
        self._json(200, order)

    def do_PATCH(self):
        path = urlparse(self.path).path
        prefix = "/api/orders/"
        if not path.startswith(prefix):
            self.send_error(404)
            return
        if not self._pin_ok():
            self._json(401, {"error": "clave"})
            return
        patch = self._body()
        if not isinstance(patch, dict):
            self._json(400, {"error": "mal"})
            return
        change = {}
        if patch.get("status") in STATUSES:
            change["status"] = patch["status"]
        if "paid" in patch:
            change["paid"] = bool(patch["paid"])
        if not change:
            self._json(400, {"error": "mal"})
            return
        oid = path[len(prefix):]
        with LOCK:
            rows = self._read()
            found = None
            for i, row in enumerate(rows):
                if row.get("id") == oid:
                    row.update(change)
                    rows[i] = row
                    found = row
            if not found:
                self._json(404, {"error": "no está"})
                return
            self._write(rows)
        self._json(200, found)

    def _pin(self):
        settings = self._book().get("settings") or {}
        pin = str(settings.get("pin") or DEFAULT_PIN)
        return pin

    def _pin_ok(self):
        given = self.headers.get("X-House-Pin", "")
        try:
            return hmac.compare_digest(given.encode("utf-8"), self._pin().encode("utf-8"))
        except (TypeError, ValueError):
            return False

    def _body(self):
        try:
            n = int(self.headers.get("Content-Length", 0) or 0)
        except ValueError:
            n = 0
        if n < 0 or n > 200000:
            return None
        raw = self.rfile.read(n) if n else b"{}"
        try:
            return json.loads(raw.decode("utf-8") or "{}")
        except (UnicodeDecodeError, json.JSONDecodeError):
            return None

    def _read(self):
        if not os.path.exists(DATA):
            return []
        with open(DATA, "r", encoding="utf-8") as handle:
            try:
                data = json.load(handle)
            except json.JSONDecodeError:
                return []
        return data if isinstance(data, list) else []

    def _find(self, oid):
        for row in self._read():
            if row.get("id") == oid:
                return row
        return None

    def _book(self):
        if not os.path.exists(BOOK):
            return {"prices": {}, "settings": {}}
        with open(BOOK, "r", encoding="utf-8") as handle:
            try:
                data = json.load(handle)
            except json.JSONDecodeError:
                return {"prices": {}, "settings": {}}
        return data if isinstance(data, dict) else {"prices": {}, "settings": {}}

    def _public_settings(self, book=None):
        settings = (book or self._book()).get("settings") or {}
        return {
            "delivery": settings.get("delivery") is not False,
            "fee": settings.get("fee") if isinstance(settings.get("fee"), int) else 250,
            "tax": settings.get("tax") if isinstance(settings.get("tax"), (int, float)) else 0.07,
            "zelle": str(settings.get("zelle") or ""),
        }

    def _prices(self, raw):
        if not isinstance(raw, dict):
            return {}
        clean = {}
        for key, value in raw.items():
            if not isinstance(key, str) or len(key) > 40:
                continue
            if isinstance(value, bool) or not isinstance(value, (int, float)):
                continue
            cents = int(value)
            if 0 <= cents <= 100000:
                clean[key] = cents
        return clean

    def _settings(self, raw):
        if not isinstance(raw, dict):
            return {}
        fee = raw.get("fee")
        tax = raw.get("tax")
        pin = str(raw.get("pin") or DEFAULT_PIN).strip()
        if not pin or len(pin) > 8:
            pin = DEFAULT_PIN
        return {
            "delivery": raw.get("delivery") is not False,
            "fee": int(fee) if isinstance(fee, (int, float)) and not isinstance(fee, bool) and 0 <= int(fee) <= 10000 else 250,
            "tax": float(tax) if isinstance(tax, (int, float)) and not isinstance(tax, bool) and 0 <= float(tax) <= 0.3 else 0.07,
            "zelle": str(raw.get("zelle") or "")[:80],
            "pin": pin,
        }

    def _clean_order(self, order):
        if not isinstance(order, dict):
            return None
        oid = str(order.get("id") or "")
        if not oid.startswith("SH-") or len(oid) > 16:
            return None
        guest = order.get("guest") if isinstance(order.get("guest"), dict) else {}
        name = str(guest.get("name") or "").strip()[:80]
        phone = str(guest.get("phone") or "").strip()[:24]
        if len(name) < 2 or len(phone) < 7:
            return None
        items = order.get("items") if isinstance(order.get("items"), list) else []
        if not items or len(items) > 40:
            return None
        clean_items = []
        for line in items:
            if not isinstance(line, dict):
                continue
            try:
                cents = int(line.get("cents") or 0)
            except (TypeError, ValueError):
                cents = 0
            clean_items.append({
                "id": str(line.get("id") or "")[:40],
                "name": str(line.get("name") or "")[:80],
                "qty": 1,
                "note": str(line.get("note") or "")[:180],
                "cents": cents if 0 <= cents <= 100000 else 0,
            })
        if not clean_items:
            return None
        service = order.get("service") if order.get("service") in ("recoger", "carrito") else "recoger"
        drop = None
        if service == "carrito" and isinstance(order.get("drop"), dict):
            raw = order["drop"]
            try:
                lat = float(raw.get("lat"))
                lng = float(raw.get("lng"))
            except (TypeError, ValueError):
                lat = lng = None
            if lat is not None and -90 <= lat <= 90 and -180 <= lng <= 180:
                drop = {
                    "label": str(raw.get("label") or "")[:160],
                    "lat": lat,
                    "lng": lng,
                    "door": str(raw.get("door") or "")[:80],
                }
        token = str(order.get("token") or "")
        if not token.isalnum() or not 8 <= len(token) <= 48:
            token = os.urandom(12).hex()
        def num(key, limit):
            try:
                value = int(order.get(key) or 0)
            except (TypeError, ValueError):
                return 0
            return value if 0 <= value <= limit else 0
        return {
            "id": oid,
            "token": token,
            "created": str(order.get("created") or "")[:40],
            "items": clean_items,
            "service": service,
            "drop": drop,
            "miles": round(float(order.get("miles") or 0), 2) if isinstance(order.get("miles"), (int, float)) and not isinstance(order.get("miles"), bool) and 0 <= float(order.get("miles") or 0) <= 20 else 0,
            "eta": num("eta", 240),
            "guest": {"name": name, "phone": phone},
            "pay": order.get("pay") if order.get("pay") in PAYS else "efectivo",
            "paid": False,
            "status": "nueva",
            "sub": num("sub", 500000),
            "fee": num("fee", 10000),
            "tax": num("tax", 100000),
            "total": num("total", 600000),
        }

    def _write_book(self, book):
        os.makedirs(os.path.dirname(BOOK), exist_ok=True)
        with open(BOOK, "w", encoding="utf-8") as handle:
            json.dump(book, handle, ensure_ascii=False, indent=2)

    def _write(self, rows):
        os.makedirs(os.path.dirname(DATA), exist_ok=True)
        with open(DATA, "w", encoding="utf-8") as handle:
            json.dump(rows, handle, ensure_ascii=False, indent=2)

    def _json(self, code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    os.chdir(ROOT)
    ThreadingHTTPServer(("127.0.0.1", 8765), Handler).serve_forever()
