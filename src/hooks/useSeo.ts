import { useEffect } from "react";
import { DEFAULT_OG_IMAGE, SITE_ORIGIN, type PageSeo } from "../seo";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

// Keeps document.title and the description/canonical/OG tags in sync with
// the current page on the client. For the handful of pages that are also
// prerendered (see scripts/prerender.tsx), this just re-applies the same
// values already baked into the static HTML; for pages that aren't
// prerendered (Browse, Motorcycle detail — unbounded dynamic data), this is
// the only mechanism setting these tags at all.
export default function useSeo({ title, description, canonicalPath, image }: PageSeo) {
  useEffect(() => {
    const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`;

    document.title = title;
    upsertMeta("name", "description", description);
    upsertLink("canonical", canonicalUrl);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", image ?? DEFAULT_OG_IMAGE);
  }, [title, description, canonicalPath, image]);
}
