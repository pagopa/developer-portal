/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
'use client';
import { useEffect, useRef } from 'react';

export type DynamicSeo = {
  readonly metaTitle?: string;
  readonly metaDescription?: string;
  readonly canonical?: string;
  readonly languages?: Readonly<Record<string, string>>;
};

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
      const canonicalURL = new URL(
        seo.canonical,
        window.location.origin
      ).toString();
      const existingLink = document.head.querySelector('link[rel="canonical"]');
      const linkTag = existingLink || document.createElement('link');
      if (!existingLink) {
        linkTag.setAttribute('rel', 'canonical');
        document.head.appendChild(linkTag);
      }
      const currentHref = linkTag.getAttribute('href');
      if (currentHref !== canonicalURL) {
        linkTag.setAttribute('href', canonicalURL);
      }
    }

    // Hreflang
    if (seo.languages !== undefined) {
      const existingLinks = document.head.querySelectorAll(
        'link[rel="alternate"][hreflang]'
      );

      existingLinks.forEach((link) => link.remove());

      Object.entries(seo.languages).forEach(([langCode, href]) => {
        const link = document.createElement('link');

        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', langCode);
        link.setAttribute('href', href);

        document.head.appendChild(link);
      });
    }

    prevRef.current = seo;
  }, [seo]);
}
