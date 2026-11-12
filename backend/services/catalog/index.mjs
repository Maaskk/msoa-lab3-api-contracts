import { readFileSync } from "node:fs";
import { serve, database, get, put, all, fail, assert } from "../../shared/runtime.mjs";
const db = database("catalog");
for (const p of JSON.parse(
  readFileSync(new URL("../../seed/products.json", import.meta.url)),
))
  if (!get(db, p.id)) {
    const { stock, ...product } = p;
    put(db, product);
  }
// Fixed demonstration price lists, not a live exchange-rate service.
const pricebook = JSON.parse(readFileSync(
  new URL("../../seed/pricebook.json", import.meta.url),
));
const currencies = ["MAD", "EUR", "USD"];
function version2(product, currency) {
  const amount = currency === "MAD" ? product.price : pricebook[String(product.id)]?.[currency];
  assert(Number.isFinite(amount) && amount >= 0, "Price unavailable in this currency", 409);
  return { ...product, price: { amount, currency } };
}
serve("catalog", async (req, url) => {
  const v2 = url.pathname === "/api/v2/products" || /^\/api\/v2\/products\/\d+$/.test(url.pathname);
  if (req.method === "GET" && v2) {
    const currency = url.searchParams.get("currency") ?? "MAD";
    assert(currencies.includes(currency), "Unsupported currency. Use MAD, EUR or USD", 400);
    if (url.pathname === "/api/v2/products") return all(db).map((p) => version2(p, currency));
    const product = get(db, url.pathname.split("/").pop());
    assert(product, "Product not found", 404);
    return version2(product, currency);
  }
  // LAB2 consumers keep exactly the numeric-price representation in MAD.
  if (req.method === "GET" && url.pathname === "/products") return all(db);
  if (req.method === "GET" && /^\/products\/\d+$/.test(url.pathname)) {
    const v = get(db, url.pathname.split("/").pop());
    if (v) return v;
  }
  fail(404, "Product not found");
});
