const URL_ = (process.env.SUPABASE_URL || "https://rujvziyjjfdjnhbuqhsr.supabase.co").replace(/\/$/, "");
const KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET = "car-images";
if (!KEY) { console.error("SUPABASE_SERVICE_KEY غير موجود"); process.exit(1); }

const H = { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" };
const thumb = p => p.replace(/\.[a-z0-9]+$/i, "_t.jpg");

async function main() {
  const now = new Date().toISOString();
  const r = await fetch(`${URL_}/rest/v1/cars?select=id,images&expires_at=lt.${encodeURIComponent(now)}&status=neq.pending&limit=500`, { headers: H });
  if (!r.ok) { console.error("فشل الجلب:", r.status, await r.text()); process.exit(1); }
  const rows = await r.json();
  console.log(`إعلانات منتهية: ${rows.length}`);
  let ok = 0;
  for (const x of rows) {
    const im = x.images || [];
    if (im.length) {
      const prefixes = im.concat(im.map(thumb));
      const d = await fetch(`${URL_}/storage/v1/object/${BUCKET}`, { method: "DELETE", headers: H, body: JSON.stringify({ prefixes }) });
      if (!d.ok) { console.error("فشل مسح الصور", x.id, d.status, await d.text()); continue; }
    }
    const q = await fetch(`${URL_}/rest/v1/cars?id=eq.${x.id}`, { method: "DELETE", headers: H });
    if (q.ok) ok++; else console.error("فشل مسح السطر", x.id, q.status);
  }
  console.log(`تم مسح ${ok} إعلان`);
}
main();
