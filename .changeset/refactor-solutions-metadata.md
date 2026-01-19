---
'gitbook-docs': patch
'nextjs-website': patch
---

Refactor solution metadata fetching to use distributed `metadata.json` files per solution directory instead of a single global file. This improves scalability and aligns with the distributed content structure.
