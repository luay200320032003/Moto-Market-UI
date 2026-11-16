// Generates sitemap.xml (or a sitemap index + split files, if over the
// 50,000-URL-per-file limit) at build time, so search engines can discover
// every listing without crawling the site link by link. Run via plain `node`
// (not vite-node) since this is just string-building — no JSX/TS needed.
//
// NOTE: there's no blog feature in this app yet (no blog index or post
// pages exist), so blog URLs are intentionally omitted. Add them here once
// that feature ships.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const SITE_ORIGIN = "https://www.motosmarketplace.com";
const MAX_URLS_PER_FILE = 50000;
const MAX_PAGES = 1000; // safety net — backend's fixed page size is 12, so this covers up to 12,000 listings

// Public, indexable pages. Deliberately excludes auth-gated pages
// (login/register/my-listings) and transactional/utility pages
// (coming-soon, ask-ai) that have no SEO value.
const STATIC_PAGES = [
  "/",
  "/Browse",
  "/Sell",
  "/subscribe",
  "/trade-in",
  "/selling-tips",
  "/about-us",
  "/contact-us",
  "/privacy-policy",
  "/terms-of-service",
];

function loadApiBase() {
  const envPath = path.join(rootDir, ".env.production");
  const text = fs.readFileSync(envPath, "utf-8");
  const match = text.match(/^VITE_API_BASE=(.+)$/m);
  if (!match) throw new Error(`VITE_API_BASE not found in ${envPath}`);
  return match[1].trim();
}

// The backend ignores `limit`/`pageSize` and always returns a fixed page of
// items, so reaching the full list means paging through until hasNextPage
// is false.
async function fetchAllListings(apiBase) {
  const collected = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetch(`${apiBase}/api/marketplace?page=${page}`);
    if (!res.ok) throw new Error(`Marketplace API responded ${res.status} on page ${page}`);
    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : [];
    collected.push(...items);
    if (!data?.hasNextPage || items.length === 0) break;
  }

  return collected;
}

function listingToUrlEntry(item) {
  const isUserListing = item.source === "listing";
  const loc = isUserListing ? `/Motorcycle?id=${item.id}&type=listing` : `/Motorcycle?id=${item.id}`;
  const lastmod = item.lastSeenAtDate ?? item.firstSeenAtDate ?? undefined;
  return { loc, lastmod };
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntryXml({ loc, lastmod }) {
  const fullLoc = escapeXml(`${SITE_ORIGIN}${loc}`);
  const lastmodTag = lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : "";
  return `  <url>\n    <loc>${fullLoc}</loc>${lastmodTag}\n  </url>`;
}

function urlsetXml(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map(urlEntryXml)
    .join("\n")}\n</urlset>\n`;
}

function sitemapIndexXml(filenames) {
  const today = new Date().toISOString().slice(0, 10);
  const entries = filenames
    .map((name) => `  <sitemap>\n    <loc>${SITE_ORIGIN}/${name}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;
}

function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function main() {
  if (!fs.existsSync(distDir)) {
    console.error(`✗ ${distDir} not found — run "vite build" before generating the sitemap.`);
    process.exit(1);
  }

  const apiBase = loadApiBase();

  let listings = [];
  try {
    listings = await fetchAllListings(apiBase);
  } catch (err) {
    console.error("✗ Failed to fetch listings for sitemap, continuing with static pages only:", err);
  }

  const staticEntries = STATIC_PAGES.map((loc) => ({ loc }));
  const listingEntries = listings.map(listingToUrlEntry);
  const allEntries = [...staticEntries, ...listingEntries];

  const chunks = chunk(allEntries, MAX_URLS_PER_FILE);

  if (chunks.length <= 1) {
    fs.writeFileSync(path.join(distDir, "sitemap.xml"), urlsetXml(allEntries), "utf-8");
    console.log(`✓ Generated sitemap.xml with ${allEntries.length} URLs`);
    return;
  }

  const filenames = chunks.map((_, i) => `sitemap-${i + 1}.xml`);
  chunks.forEach((entries, i) => {
    fs.writeFileSync(path.join(distDir, filenames[i]), urlsetXml(entries), "utf-8");
  });
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemapIndexXml(filenames), "utf-8");
  console.log(`✓ Generated sitemap index with ${chunks.length} files covering ${allEntries.length} URLs`);
}

main();
