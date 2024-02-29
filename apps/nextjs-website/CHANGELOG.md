# nextjs-website

## 0.11.0

### Minor Changes

- 3e00190: [DPC-141] Add new version for "Carta Giovani Nazionale - Documentazione Tecnica"

## 0.10.0

### Minor Changes

- 1e4b96e: Allow fetching from the CMS the "Discover our ecosystem" section on the home page

### Patch Changes

- c58c050: Fix link visualization
- 532f1d6: Fix change password page and changed password page
- b2ac24a: Fix reset password request page

## 0.9.2

### Patch Changes

- 875b2cb: [DEV-1375] Allow fetching documentation from a specific branch of the `devportal-docs` repository and enable sync of the documentation from "docs/from-gitbook" branch instead of from a commit id
- 7322534: Fix sign-up and confirm sign-up UI and UX
- c571989: Fix edit password card UX and UI in user profile section
- c14d7e5: Fix sign-in and confirm sign-in UI and UX

## 0.9.1

### Patch Changes

- 3d86bfc: Remove the expireAt attribute from dynamodb that store the webinar questions

## 0.9.0

### Minor Changes

- 50f538f: [DEV-1054]: Add webinars' questions page
- a481265: [DEV-1363] Fetch homepage props from Strapi

### Patch Changes

- 013a47f: [DEV-1278]: uniform footer design
- 0c33e93: Close mobile menu on links click

## 0.8.0

### Minor Changes

- b2f50b8: [DEV-1040] Rendering component OpenAPI Gitbook
- 2370d7e: [DEV-866] Redirect to the main guide if no version is specified from the path
- d39d27a: [DPC-138] Add version 3.6.1 for "SANP"
- 910f54a: [DEV-1362] Create BuildEnv and create function to use to make API calls to Strapi
- a305b3d: Show export button in StopLight Element's component of API pages

### Patch Changes

- 4caeaaf: Add EmailFormWrapper unit tests
- 1352c9e: [DEV-1364] Remove AppEnv and Config in favor of the BrowserEnv and BrowserConfig
- 558d23c: [DEV-863]: Replace URLs host if specified in config
- 4a34f5d: [DEV-863]: Add missing paths in urlReplacesMap URLs
- f67d231: [DEV-1238] Resizing the "Featured" section as the page loads
- 8026026: Fix title alignment in API pages
- Updated dependencies [b2f50b8]
- Updated dependencies [e976969]
- Updated dependencies [558d23c]
- Updated dependencies [7a6ee42]
  - gitbook-docs@0.0.1

## 0.7.2

### Patch Changes

- b9b9a21: Fix XSS issue

## 0.7.1

### Patch Changes

- 7c3c680: Fix speakers and speakersTitle label in Webinar section

## 0.7.0

### Minor Changes

- eadf4e3: Add form to update email attribute of the current user

### Patch Changes

- dc5ece2: [DEV-1309] Update WebinarQuestionsForm logic

## 0.6.0

### Minor Changes

- 4698cbe: Add webinars list page

### Patch Changes

- 59c5c0a: Fix homepage vertical align
- efab9d0: Fix background color issue with Hero component
- 56fb867: Update profile page copy
- af54da5: Sanitize the input so that users cannot write formulas that are executed in excel
- c98c1cf: [DEV-1235] Preload font
- d0fbfb2: [DEV-1239] Implementation of user profile mobile menu
- 0270936: Fix webinar show button visible only in webinars and home pages
- 808285d: [DEV-1243] Guide mobile menu

## 0.5.0

### Minor Changes

- 4356032: Add version 5.0 for "Guida Tecnica - IO, l’app dei servizi pubblici"

### Patch Changes

- 258ae2b: Fix mobile slider on home page
- 59fe6b0: Fix mobile layout on guides page
- afc6693: Remove hardcoded colors from the app
- 89b45c6: Improve scripts loading
- de51361: Fix carousel margin on mobile
