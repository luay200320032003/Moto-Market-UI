// Prerenders a handful of static, data-free pages to real HTML at build time,
// so crawlers that don't execute JS (e.g. Google AdSense's reviewer) see
// actual content instead of the empty <div id="root"></div> shell — that
// empty shell is what got this site flagged as "low value content."
//
// Deliberately does NOT reuse the app's full route tree (src/App.tsx) — that
// tree eagerly imports every page, including ones with real side effects at
// module load time (e.g. Subscribe.tsx calls Stripe's loadStripe() at the
// top of the file, which touches `document` and breaks under Node/SSR).
// This script only imports the pages confirmed safe to render on the server:
// no browser-only APIs outside of effects, no module-level side effects.
//
// Run via `vite-node` (see package.json's "build" script) so this .tsx file
// gets the same JSX/TS/alias handling as the rest of the app, without a
// separate build step or a new SSR framework.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { Routes, Route } from "react-router-dom";
import { StaticRouter } from "react-router";
import pretty from "pretty";

import Layout from "../src/Layout";
import Home from "../src/pages/Home";
import Browse from "../src/pages/Browse";
import MotocyclePage from "../src/pages/Motocycle";
import AboutUs from "../src/pages/AboutUs";
import PrivacyPolicy from "../src/pages/PrivacyPolicy";
import TermsOfService from "../src/pages/TermsOfService";
import ContactUs from "../src/pages/ContactUs";
import SellingTips from "../src/pages/SellingTips";
import { mapToMotorcycle } from "../src/services/MotorcycleService";
import type { Motorcycle } from "../src/Entities/Motorcycle";
import {
  injectSeo,
  listingSeo,
  motorcyclePath,
  HOME_SEO,
  BROWSE_SEO,
  ABOUT_US_SEO,
  PRIVACY_POLICY_SEO,
  TERMS_OF_SERVICE_SEO,
  CONTACT_US_SEO,
  SELLING_TIPS_SEO,
  type PageSeo,
} from "../src/seo";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const templatePath = path.join(distDir, "index.html");

const ROUTE_SEO: Record<string, PageSeo> = {
  "/": HOME_SEO,
  "/Browse": BROWSE_SEO,
  "/about-us": ABOUT_US_SEO,
  "/privacy-policy": PRIVACY_POLICY_SEO,
  "/terms-of-service": TERMS_OF_SERVICE_SEO,
  "/contact-us": CONTACT_US_SEO,
  "/selling-tips": SELLING_TIPS_SEO,
};

const ROUTES = Object.keys(ROUTE_SEO);

// The backend ignores `limit`/`pageSize` and always returns a fixed page of
// items, so reaching the full list means paging through until hasNextPage
// is false. Fetched once and reused both to seed Home's motorcycle sections
// and to prerender one real static page per listing below — a single crawl
// instead of fetching the catalog twice.
async function fetchAllListings(): Promise<Motorcycle[]> {
  const maxPages = 1000; // safety net — fixed page size of 12 covers up to 12,000 listings
  const apiBase = import.meta.env.VITE_API_BASE;
  const collected: Motorcycle[] = [];

  try {
    for (let page = 1; page <= maxPages; page++) {
      const res = await fetch(`${apiBase}/api/marketplace?page=${page}`);
      if (!res.ok) throw new Error(`Marketplace API responded ${res.status} on page ${page}`);
      const data = await res.json();
      const items: any[] = Array.isArray(data?.items) ? data.items : [];
      collected.push(...items.map(mapToMotorcycle));
      if (!data?.hasNextPage || items.length === 0) break;
    }
  } catch (err) {
    console.error("✗ Failed to fetch listings for prerendering, continuing with what was collected so far:", err);
  }

  return collected;
}

// "Similar" bikes just means "the next few in the catalog, excluding this
// one" — matching what the live page already does (it fetches page 1 with
// limit 4 and filters the current bike out), not a real similarity match.
function pickSimilar(all: Motorcycle[], current: Motorcycle, count: number): Motorcycle[] {
  return all.filter((m) => m.id !== current.id).slice(0, count);
}

function PrerenderRoutes({ homeMotorcycles }: { homeMotorcycles: Motorcycle[] }) {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home initialMotorcycles={homeMotorcycles} />} />
        <Route path="/Browse" element={<Browse />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/selling-tips" element={<SellingTips />} />
      </Route>
    </Routes>
  );
}

function renderListingPage(bike: Motorcycle, similar: Motorcycle[], routePath: string) {
  return renderToStaticMarkup(
    <StaticRouter location={routePath}>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/Motorcycle/:type/:id"
            element={<MotocyclePage initialMotorcycle={bike} initialSimilar={similar} />}
          />
        </Route>
      </Routes>
    </StaticRouter>
  );
}

async function main() {
  if (!fs.existsSync(templatePath)) {
    console.error(`✗ ${templatePath} not found — run "vite build" before prerendering.`);
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, "utf-8");
  const allListings = await fetchAllListings();
  const homeMotorcycles = allListings.slice(0, 100);
  let failures = 0;

  for (const route of ROUTES) {
    try {
      const appHtml = renderToStaticMarkup(
        <StaticRouter location={route}>
          <PrerenderRoutes homeMotorcycles={homeMotorcycles} />
        </StaticRouter>
      );

      const templateWithSeo = injectSeo(template, ROUTE_SEO[route]);
      const rawHtml = templateWithSeo.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
      const html = pretty(rawHtml, { ocd: false });

      const outDir = route === "/" ? distDir : path.join(distDir, route);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
      console.log(`✓ Prerendered ${route}`);
    } catch (err) {
      failures++;
      console.error(`✗ Failed to prerender ${route}:`, err);
    }
  }

  // One real static file per listing, so each gets genuinely unique SEO tags
  // and content in the HTML crawlers receive — not pretty-printed (unlike
  // the static pages above), since that's a per-file formatting cost not
  // worth paying thousands of times over for machine-generated pages.
  let listingFailures = 0;
  for (const bike of allListings) {
    try {
      const isUserListing = bike.source === "listing";
      const routePath = motorcyclePath(bike.id, isUserListing);
      const seo = listingSeo({
        id: bike.id,
        year: bike.year,
        make: bike.make,
        model: bike.model,
        price: bike.price,
        mileage: bike.mileage,
        location: bike.location,
        isUserListing,
        image: bike.image_urls?.[0],
      });

      const appHtml = renderListingPage(bike, pickSimilar(allListings, bike, 4), routePath);
      const templateWithSeo = injectSeo(template, seo);
      const html = templateWithSeo.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

      const outDir = path.join(distDir, routePath);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
    } catch (err) {
      listingFailures++;
      console.error(`✗ Failed to prerender listing ${bike.id}:`, err);
    }
  }
  console.log(`✓ Prerendered ${allListings.length - listingFailures}/${allListings.length} listing pages`);

  if (failures > 0 || listingFailures > 0) {
    process.exit(1);
  }
}

main();
