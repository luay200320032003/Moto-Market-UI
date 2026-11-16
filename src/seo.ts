// Single source of truth for page metadata (title/description/canonical/OG
// image) — shared by the client-side `useSeo` hook (src/hooks/useSeo.ts)
// and the build-time prerender script (scripts/prerender.tsx), so both
// produce identical tags for the same page instead of drifting apart.

export const SITE_ORIGIN = "https://www.motosmarketplace.com";
export const SITE_NAME = "Motos Marketplace";
export const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200";

export interface PageSeo {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
}

export const HOME_SEO: PageSeo = {
  title: `Motorcycles for Sale – Buy & Sell New and Used Bikes | ${SITE_NAME}`,
  description:
    "Browse thousands of motorcycles for sale from trusted dealers and private sellers. Compare prices, explore listings, and find your perfect ride on Motos Marketplace.",
  canonicalPath: "/",
};

export const BROWSE_SEO: PageSeo = {
  title: `Browse Motorcycles for Sale | ${SITE_NAME}`,
  description:
    "Search thousands of motorcycles for sale by make, model, price, and location. Find your next bike on Motos Marketplace.",
  canonicalPath: "/Browse",
};

export const ABOUT_US_SEO: PageSeo = {
  title: `About Us | ${SITE_NAME}`,
  description: `Learn about ${SITE_NAME}, the online marketplace connecting motorcycle buyers with trusted dealers and private sellers.`,
  canonicalPath: "/about-us",
};

export const CONTACT_US_SEO: PageSeo = {
  title: `Contact Us | ${SITE_NAME}`,
  description: `Get in touch with the ${SITE_NAME} team with questions, feedback, or support requests.`,
  canonicalPath: "/contact-us",
};

export const PRIVACY_POLICY_SEO: PageSeo = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `Read the ${SITE_NAME} privacy policy to learn how we collect, use, and protect your information.`,
  canonicalPath: "/privacy-policy",
};

export const TERMS_OF_SERVICE_SEO: PageSeo = {
  title: `Terms of Service | ${SITE_NAME}`,
  description: `Read the terms of service governing your use of ${SITE_NAME}.`,
  canonicalPath: "/terms-of-service",
};

export const SELLING_TIPS_SEO: PageSeo = {
  title: `Motorcycle Selling Tips | ${SITE_NAME}`,
  description: `Tips and best practices for selling your motorcycle fast and for the best price on ${SITE_NAME}.`,
  canonicalPath: "/selling-tips",
};

export const LISTING_FALLBACK_SEO: PageSeo = {
  title: `Motorcycle for Sale | ${SITE_NAME}`,
  description: `View this motorcycle listing on ${SITE_NAME}.`,
  canonicalPath: "/Motorcycle",
};

// Path-based listing URL — one real static file per listing (see
// scripts/prerender.tsx), so each gets genuinely unique HTML instead of all
// listings sharing the single query-string-routed /Motorcycle page, which
// Azure Static Web Apps can't vary by query string.
export function motorcyclePath(id: string | number, isUserListing?: boolean): string {
  return `/Motorcycle/${isUserListing ? "listing" : "market"}/${id}`;
}

// Matches the "{Year} {Make} {Model} for Sale – ${Price} | Motos Marketplace"
// pattern. id/isUserListing determine the canonical path, matching the
// market-vs-listing route split used throughout the app.
export function listingSeo(params: {
  id: string | number;
  year?: number | string;
  make?: string;
  model?: string;
  price?: number;
  mileage?: number;
  location?: string;
  isUserListing?: boolean;
  image?: string;
}): PageSeo {
  const { id, year, make, model, price, mileage, location, isUserListing, image } = params;
  const subject = [year, make, model].filter(Boolean).join(" ") || "Motorcycle";
  const priceText = price != null && price > 0 ? `$${Number(price).toLocaleString()}` : "Inquire for Price";
  const mileageText = mileage != null && mileage > 0 ? `${Number(mileage).toLocaleString()} miles` : "low mileage";
  const locationText = location ? ` in ${location}` : "";

  return {
    title: `${subject} for Sale – ${priceText} | ${SITE_NAME}`,
    description: `${subject} for sale${locationText} for ${priceText} with ${mileageText} — view photos, specs, and contact the seller on ${SITE_NAME}.`,
    canonicalPath: motorcyclePath(id, isUserListing),
    image,
  };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Rewrites the head tags in a raw HTML template string to match the given
// page's metadata. Used only by the prerender script (server-side, no DOM)
// — the client-side equivalent is the useSeo hook.
export function injectSeo(template: string, seo: PageSeo): string {
  const canonicalUrl = `${SITE_ORIGIN}${seo.canonicalPath}`;
  const image = seo.image ?? DEFAULT_OG_IMAGE;
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);

  return template
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/?>/s, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/?>/s, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace(/<meta property="og:title" content=".*?"\s*\/?>/s, `<meta property="og:title" content="${title}" />`)
    .replace(
      /<meta property="og:description" content=".*?"\s*\/?>/s,
      `<meta property="og:description" content="${description}" />`
    )
    .replace(/<meta property="og:url" content=".*?"\s*\/?>/s, `<meta property="og:url" content="${canonicalUrl}" />`)
    .replace(/<meta property="og:image" content=".*?"\s*\/?>/s, `<meta property="og:image" content="${image}" />`);
}
