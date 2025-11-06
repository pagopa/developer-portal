/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
'use client';
import { useEffect, useRef } from 'react';

export type DynamicSeo = {
  readonly metaTitle?: string;
  readonly metaDescription?: string;
  readonly canonical?: string;
};

/**
 * useDynamicSeo
 * Applies dynamic SEO updates (title, meta description, canonical) after render.
 * Designed for client transitions where Next.js metadata API was originally server-only.
 * Avoids mutating existing DOM nodes directly; instead replaces <title> element and sets attributes.
 */
export function useDynamicSeo(seo: DynamicSeo | null) {
  const prevRef = useRef<DynamicSeo | null>(null);
  useEffect(() => {
    if (typeof document === 'undefined' || !seo?.metaTitle) return;

    // Title
    if (seo.metaTitle && seo.metaTitle !== prevRef.current?.metaTitle) {
      // eslint-disable-next-line functional/no-expression-statements
      document.title = seo.metaTitle;
    }

    // Meta description
    if (
      seo.metaDescription &&
      seo.metaDescription !== prevRef.current?.metaDescription
    ) {
      const existingMeta = document.head.querySelector(
        'meta[name="description"]'
      );
      const metaTag = existingMeta || document.createElement('meta');
      if (!existingMeta) {
        metaTag.setAttribute('name', 'description');
        document.head.appendChild(metaTag);
      }
      const currentContent = metaTag.getAttribute('content');
      if (currentContent !== seo.metaDescription) {
        metaTag.setAttribute('content', seo.metaDescription);
      }
    }

    // Canonical link
    if (seo.canonical && seo.canonical !== prevRef.current?.canonical) {
      const existingLink = document.head.querySelector('link[rel="canonical"]');
      const linkTag = existingLink || document.createElement('link');
      if (!existingLink) {
        linkTag.setAttribute('rel', 'canonical');
        document.head.appendChild(linkTag);
      }
      const currentHref = linkTag.getAttribute('href');
      if (currentHref !== seo.canonical) {
        linkTag.setAttribute('href', seo.canonical);
      }
    }

    prevRef.current = seo;
  }, [seo?.metaTitle, seo?.metaDescription, seo?.canonical, seo]);
}
