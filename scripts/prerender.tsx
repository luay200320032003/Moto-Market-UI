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

import Layout from "../src/Layout";
import Home from "../src/pages/Home";
import AboutUs from "../src/pages/AboutUs";
import PrivacyPolicy from "../src/pages/PrivacyPolicy";
import TermsOfService from "../src/pages/TermsOfService";
import ContactUs from "../src/pages/ContactUs";
import SellingTips from "../src/pages/SellingTips";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const templatePath = path.join(distDir, "index.html");

const ROUTES = ["/", "/about-us", "/privacy-policy", "/terms-of-service", "/contact-us", "/selling-tips"];

function PrerenderRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/selling-tips" element={<SellingTips />} />
      </Route>
    </Routes>
  );
}

async function main() {
  if (!fs.existsSync(templatePath)) {
    console.error(`✗ ${templatePath} not found — run "vite build" before prerendering.`);
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, "utf-8");
  let failures = 0;

  for (const route of ROUTES) {
    try {
      const appHtml = renderToStaticMarkup(
        <StaticRouter location={route}>
          <PrerenderRoutes />
        </StaticRouter>
      );

      const html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

      const outDir = route === "/" ? distDir : path.join(distDir, route);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
      console.log(`✓ Prerendered ${route}`);
    } catch (err) {
      failures++;
      console.error(`✗ Failed to prerender ${route}:`, err);
    }
  }

  if (failures > 0) {
    process.exit(1);
  }
}

main();
