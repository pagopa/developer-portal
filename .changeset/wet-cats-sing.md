---
"nextjs-website": minor
---

Implement sitemap generation logic for all routes in Italian and English.

This update includes:
-   **Types Updates:** added `locale`, `localizations`, and `updatedAt` to Strapi types (`StrapiBaseProduct`, `StrapiWebinar`, etc.) and Page Prop interfaces.
-   **Sitemap Generation:** Updated `src/app/sitemap.ts` to utilize `locale` and `localizations` from CMS data to generate correct localized URLs for all route types (guides, solutions, webinars, etc.).
-   **API Routes:** Updated `api/guides` and `api/release-note` routes to include `locale` and `updatedAt` in their response payloads.
-   **Fixtures & Factories:** Systematically updated all test fixtures and factories (`products.ts`, `webinars.ts`, `guideListPages.ts`, etc.) to include the new required `locale` and `updatedAt` fields, ensuring tests align with the updated types and logic.
-   **Templates**: Updated `ApiDataListPageTemplate` to accept and use `locale`.
