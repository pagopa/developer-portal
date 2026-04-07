---
"nextjs-website": patch
---

Refactor quickStartGuides API layer to repository pattern

- move strapi fetch, mapper, types and tests to quickStartGuides dir
- move fixture and factories to shared \_\_tests\_\_ folder
- move parts to a separate isolated dir in lib/
