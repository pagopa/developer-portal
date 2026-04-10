---
"nextjs-website": patch
---

Refactor homepage API layer to repository pattern

- Move fetcher to retrieve guide list pages from Strapi into homepage folder.
- Move makeHomepageProp into mapper in homepage folder.
- Implement repository pattern for accessing homepage data.
- Move tests into homepage folder.
- Move factories and fixtures into shared folder.
- Refactor types to export StrapiHomepage to include RootEntity wrapper.
