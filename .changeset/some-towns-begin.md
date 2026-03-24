---
"nextjs-website": patch
---

Revert to using localStorage to store Amplify auth tokens and user data, and create a custom `isLoggedIn` cookie to enable rerouting for authenticated users.
