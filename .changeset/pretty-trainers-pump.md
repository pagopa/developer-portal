---
"strapi-cms": patch
"nextjs-website": patch
---

Upgrade to Strapi version 4.25.20:
- Set 18.18 as default Node.js version
- Set fixed versions in nextjs-website/package.json to compile with node 18.18.0
- Add 'use client' to Hero component
- Add a workaround to avoid "Page is missing 'generateStaticParams()'" error
