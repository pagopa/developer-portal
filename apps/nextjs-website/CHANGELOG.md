# nextjs-website

## 4.13.1

### Patch Changes

- fd6bfde: Add push event for chatbot button click

## 4.13.0

### Minor Changes

- 7ac487f: Fix related links and webinar codec
- fe61351: Add history to send query endpoint

## 4.12.0

### Minor Changes

- aa761a7: Chat uses local storage to save chat session information

### Patch Changes

- 63a2efc: Update .env.default files for strapi and nextjs, update README.md
- 2ce3156: Fix feedback in chatbot hook

## 4.11.0

### Minor Changes

- acae444: Add modal to confirm history deletion
- 0fe4dff: Update url mapping for documentation
- 3f63584: Update title for chat history sessions
- 27ed2cf: Fix the header in the guide page

### Patch Changes

- d572be4: fix reference in anchorEl for chatbot
- e6b7263: Remove warnings from build output
- 42d423c: Fix chatbot response layout by showing one link per line
- 980fe99: Add healthz call on chatbot popoup
- bc51ec3: Fix issue with error remaining on screen
- 23f27b8: Remove subtitle from banner link codec
- 8a2a203: Add UrlReplaceMapCodec and mapping function
- 3881914: Fix margins and text size of guides and tutorials
- 6741ec9: Fix tutorial's in page menu
- 60bd477: Fix chatbot issue with sending empty messages
- d5d09b6: Fix chat messages with long words from going off the screen
- Updated dependencies [e6b7263]
  - gitbook-docs@0.2.1

## 4.10.0

### Minor Changes

- 891ba3e: Add bannerLinks attribute to all product pages codecs
- c417ceb: Add product's bannerLinks fallback to all product pages
- 41fe437: Add a new URL to be mapped in products.ts file

### Patch Changes

- a54d147: Fix paragraph margins and WordBreak setting in ckEditor tables
- 80e3cae: Fix style for list items in ckEditor content
- a5ef8c4: Set conditional visibility of Products section in SolutionTemplate
- 6d2f8b8: Add product to ApiData codec
- 5852b22: Add the bannerLinks attribute to the product codec and refactor its relationships

## 4.9.0

### Minor Changes

- 803e41e: Add links to headings created with CKEditor in the in-page menu of Tutorial pages
- fda6c3d: Add SEO to codecs and generate metadata in pages
- 366c864: Add chatbot history list component
- 366c864: Add chatobot layout component
- 1e9b58d: Add structured data to alla pages
- b278f87: Guest chatbot message
- bb1a614: Add chatbot chat history detail layout

### Patch Changes

- 3b81539: Set font size to be 16px on bold and italic sections
- 86ffbd6: Add padding and margin to mobile version in ecosystem cards
- e2ce39e: Add margin bottom to block content images
- af68449: Add wordwrap break word to links
- 695f025: Fix product layout path for Api page
- e564dad: Remove input text and history button if user not logged in
- 86ffbd6: Fix ecosystem and card grid for correct card box shadows
- f1092ae: Add api title to breadcrumbs

## 4.8.0

### Minor Changes

- 72c13cc: Add error alerts in chatbot chat

### Patch Changes

- d2b0c30: Change chatbot name, update chatbot first message and fix chatbot button size
- 617fef4: Fix the label of the guide links on the overview page
- bd9206d: Fix selectEmbedType method by adding 'design' option to Figma urls
- 3928519: Fix guidesTitle's position in Overview's PostIntegration component
- f683aa5: Fix Stats component layout in Solution's page

## 4.7.0

### Minor Changes

- 47637c0: Add style to content generated with CKEditor in Strapi
- 1bf8e5b: Add structured data functions and add them to homepage
- 8fa630b: Show statsSource attribute in Stats component
- 828faf3: Add CKEditor renderer to NextJS

### Patch Changes

- 7146095: Fix Webinar's bodyContent margins
- 76c4593: Fix text alignment when quote is short in Quote component and add "ShortQuote" story to Storybook

## 4.6.0

### Minor Changes

- b40773a: Add bannerLinks to product's overview page in NextJs
- fd090f7: [DPC-298] Update link in overview SEND
- 2fd2d35: Connect product tutorial list page to Strapi content
- 2fd2d35: Add tutorial list pages codec
- 9d2120b: Add version 2.4 of "Manuale dei Servizi"

### Patch Changes

- 9547654: Refactor guides codec
- 7b045c2: Fix Guides page generateStaticParams method
- fe97c1b: Refactor SEO codec, SolutionDetail codec and SolutionTemplateProps
- 95e0cc5: Using id token instead of access token to authenticate api calls
- 46746b4: Add makeProps folder
- 9cb88cf: Refactor homepage codec
- ecb45cc: Refactor ApiDataList and ApiDataListPages codecs
- afc9ecd: Refactor Overviews codec
- c05180d: Refactor Solutions, SolutionListPage and CaseHistories codecs
- ece2b34: Refactor QuickStartGuides codec
- 429a1d5: Refactor webinars codec
- c038519: Refactor guideListPages codec

## 4.5.0

### Minor Changes

- dfca6c0: Add seo attribute to homepage codec
- dd8889b: Add feedback button
- 003ebc7: Connect overview pages to Strapi CMS
- 61e7045: Add overview codec and test
- dd8889b: Add copy to clipboard button
- f3d31db: Connect guide list page to Strapi data and
- 29dafaf: Connect Guide to Strapi data
- 05745a3: Meta tags in home page taken from strapi
- 59317cd: Add anchor id to QuestionsAndAnswers component container

### Patch Changes

- 6c96fbc: Fix link style in webinar Q&A's answers
- c9bbea3: Fix the margins of webinar related resources
- 2d14ea6: Fix the call to action button variant in the ecosystem section of the homepage
- 4cfbcb3: Fix overview page input data and card links

## 4.4.0

### Minor Changes

- 52ed6a5: Update chatbot message component
- 52ed6a5: Update input text area
- ac0f692: Add feedback button
- 5ff6c58: Add guides and guide list codecs
- 0696e98: Add new pagoPA manual "Stampa Avvisi di Pagamento"
- 52ed6a5: Update layout and style of chat component
- 564bb78: Add lateral menu on Strapi tutorials
- 52ed6a5: New chatbot button style

### Patch Changes

- 595543d: Add wrapper to identify tag for chatbot analysis
- 2b17572: Add chat skeleton
- 0ee63ba: Change in path rewrite for "Manuale Back office EC/PT/PSP"
- 81b0ef4: Add a parser to convert chatbot messages from Markdown to HTML format
- 45014a7: Hide webinar questions instead of not render when collapsed

## 4.3.0

### Minor Changes

- 0e1497e: Add Chatbot API
- fbed94f: Add Chatbot to nextjs app

## 4.2.1

### Patch Changes

- 8931efc: Fix case histories path

## 4.2.0

### Minor Changes

- dea108c: Add CaseHistories to Solution template

## 4.1.0

### Minor Changes

- 6275174: Add and connect RelatedResources and QuestionsAndAnswers to webinar
- f5d06c4: Add code modifier to BlockRendererClient to render code tag with CodeBlockPart
- 53d26d1: Add QuestionsAndAnswers component
- 83175b4: Add questionsAndAnswers attribute to Webinar codec
- 6d518da: Add related resources to webinar
- ed77bbf: Add RelatedResources and DownloadableDocuments components

### Patch Changes

- 4daeff5: Remove quotes from Tutorial pages
- 4a56ca6: Update speaker list layout in webinar page and in its preview card
- 34a1706: Fix spacing in case history page

## 4.0.0

### Major Changes

- 5ee06d5: Remove incorrect plural from SolutionsListPage on FE

### Minor Changes

- 82fe16d: Add Chat molecule component

### Patch Changes

- b3d75ad: Remove "page" word from template files
- dfc223a: Hide the entire statistics section on the Solution page when there are no values ​​to show

## 3.0.0

### Major Changes

- 046d050: Add parts on tutorial on FE

### Minor Changes

- 0689ebb: Add ChatBot FAB
- bf211f4: Add ChatMessage atom component
- 5a64300: Add new atom component ChatInputText

### Patch Changes

- 78343e2: Replace icons in startInfo
- 23dc5cf: Add BorderTop to ApiSection

## 2.0.0

### Major Changes

- 093cc4b: Add ApiDataListPage and update api page to show content from CMS

### Minor Changes

- 2b0f3cf: Fix the CTA in solution page
- 258a19d: Fix stats layout
- b01d5eb: fix href for ecosystem
- 2984b84: Add shortName to Product and use it in labels
- 73c7dc1: Update SANP version from 3.7.1 to 3.8.0

### Patch Changes

- 9af4032: Remove the link to the SOAP API from pagoPA overview page
- a5f506b: Fix solution webinars title
- 818c087: Fix label "Esplora le API" in ApiDataListPage
- 5c3949c: Fix ApiDataPage generateStaticParams function

## 1.1.0

### Minor Changes

- 2400316: Add ApiDataListPageTemplate to the project

### Patch Changes

- 456ca42: Version update from 3.2.1 to 3.3.0 of the "Payment Notices" manual
- 8f036cd: Show all available steps in the SolutionPreviewCard component
- e713faa: Fix margin on solution list card labels

## 1.0.0

### Major Changes

- e8e3ef3: Refactor homepage to include the new Ecosystem component

### Patch Changes

- bb29d68: Fix solution build error
- 60664b4: Add test to homepage
- a5152a9: Show introductionToSteps field in Solution's preview card

## 0.30.0

### Minor Changes

- d049206: Update version of "Manuale Servizi" from v2.2 to v2.3
- f309b42: Reduce text in topics for "I modelli dei servizi"
- 0bda017: Add "I modelli dei servizi" to the list of appIO's manuals

### Patch Changes

- 6ef79e2: Fix product list data and layout in Solution page
- 81bb7f1: Remove hardcoded webinars
- 801e21f: Fix solution detail pages routing
- caa48f5: Add solutions link

## 0.29.0

### Minor Changes

- 9124dc1: Create a common template for guides and solutions pages

### Patch Changes

- 62bcc36: Add features field on SolutionsListPage

## 0.28.0

### Minor Changes

- de59d44: Fix user password change on profile page
- ff1e3e8: Add solutions list page
- 401ee16: Create a common template for guides and solutions pages

## 0.27.0

### Minor Changes

- ce71269: Add Solution page
- cba50f2: Update BannerLinks layout and BannerLink input props and layout
- 131e95e: Version update "Manuale Operativo" SEND

### Patch Changes

- bc752c2: Fix relatedLink in appIO's overview
- 021b82b: Fetch tutorial from strapi and add codecs
- e3a57a4: Fix getTutorialPaths output
- 4f58966: Set the validity duration of the MFA code
- 757ddc5: Remove DOMPurify.sanitize from TypographyPart component

## 0.26.0

### Minor Changes

- 4a477d0: Add SolutionsTemplate component
- 6b31e7c: Add Stats component
- 40977c4: Add case history page
- 2411a44: Added GH actions to redeploy latest tag when deploying from CMS
- e35778c: Add new tutorial IO and change sorting and display of tutorials on the "Panoramica" page
- 330590a: Add new guide "Kit Comunicazione" to SEND
- fa708e2: Add solution page template
- 34be742: Add CaseHistoryPageTemplate and related story

### Patch Changes

- fa708e2: Fix Storybook .env error
- f20337c: Add different optimized command to download docs from gitbook
- d8a564e: Add TabComponent to handle tabs
- 76913d2: Fix update-docs script

## 0.25.0

### Minor Changes

- 32f7b14: Add quickstart codec and manage fetch
- 2f2ef37: Add Solution Preview Card
- 2f2ef37: Add SolutionStep component
- ffd196b: Manage quickstart from CMS and refactor static content

### Patch Changes

- 28118e1: Fix anchor position on scroll

## 0.24.0

### Minor Changes

- 25b28b1: Add breadcrumbs to website pages

### Patch Changes

- 413e10a: Fix webinars' images responsiveness
- fe05e70: Refactor CtaCard to allow an array of tags in input
- ce380cf: Refactor Feature component to use dark style programmatically
- 088eadf: Fix quickstart icon colors
- c7eb7c7: Add quote component

## 0.23.1

### Patch Changes

- e3e55d5: Fix webinars' paragraphs

## 0.23.0

### Minor Changes

- 5d8ef2a: Move webinars subscriptions to Dynamo DB

### Patch Changes

- f1442cb: Fix tutorial templage page

## 0.22.0

### Minor Changes

- d080679: Version Update for Guida Tecnica IO
- ffc7a6b: Add version 2.2 for "Manuale dei Servizi" of app IO
- f1e20f8: Replacement of placeholder images with definitive ones

## 0.21.0

### Minor Changes

- 08924f8: Scroll the guide menu to the selected item
- 0800051: SACI version update
- 49057cd: Update SANP version
- acca28c: Add PDND product
- c84b885: Fix links to Selfcare backoffice
- e931eb7: Add versions 2.3 and 2.4 to the SEND Knowledge Base and change the main in 2.4
- 593d521: Change step 05 in "Guida Rapida" SEND
- da40035: Hide PDND product

### Patch Changes

- 5168bff: Redirect after successful login if redirect query string is present
- 2bb4795: Fix news showcase alignment on homepage
- e56b342: Add mermaid support
- ea1b31e: Align webinars speakers' box
- b515ada: Increase the distance between the menu and title of guides and manuals pages
- Updated dependencies [c84b885]
- Updated dependencies [d16d58b]
  - gitbook-docs@0.2.0

## 0.20.0

### Minor Changes

- 119f576: Display webinars coming from Strapi in the homepage
- 59c69ed: Rename webinar's field from textContent to bodyContent

### Patch Changes

- 31991a7: Update homepage webinars' sections to display future and past webinars
- a064905: Sort webinars list to show the upcoming webinar on banner
- 0580401: Align "Go to webinar" buttons
- 1cf5c18: Update "Messaggi a contenuto remoto" webinar src

## 0.19.0

### Minor Changes

- 6661cf5: Add new DevTalks pagoPA - GDP
- 54f276b: Add contents for next PagoPA Lab about TARI

## 0.18.0

### Minor Changes

- 91c56ea: Add version 2.1 for "Manuale dei Servizi" of app IO
- 4479996: New guide "Modelli dei Servizi" for app IO
- 7d4b800: Add 2 new tutorials to the pagoPA tutorial page:
  - "Come diventare Partner Tecnologico di PagoPA"
  - "Come migrare alla Nuova Connettività"

### Patch Changes

- 5852a9a: Update the local state of the webinar's questions page when an user highlight or hide a question to show the changes in real time.

## 0.17.0

### Minor Changes

- 9aab500: Update of SANP version from 3.6.1 to 3.7.0.

### Patch Changes

- e496be4: Fix the rendering of a single tab in a group of tabs

## 0.16.1

### Patch Changes

- d727662: Update id of 'Esplorando App IO: I messaggi a contenuto remoto' webinar

## 0.16.0

### Minor Changes

- ea340e9: Add fetch from Strapi for webinars

### Patch Changes

- fb3692b: Update webinars images
- b842990: Add BlocksRendererClient component to render the blocks content coming from Strapi
- 7f7ea27: Change the subtitle of "Esplorando App IO: I messaggi a contenuto remoto" webinar

## 0.15.3

### Patch Changes

- 9bd7fae: Add signup form tests
- 61648ac: Reset change password form errors on user changes
- 83fd73c: Reset signup form errors if user updates form
- 83f9652: Reset change password form errors on user changes

## 0.15.2

### Patch Changes

- 33ed5cd: Handle webinar questions form submit with a combination of keys
- 6bb0719: Set endDateTime of 'always-live' webinar to year 2077
- 4279732: Fix cover image of the webinar "Esplorando App IO: I messaggi a contenuto remoto"
- fc8c838: Reset login code form errors on user changes

## 0.15.1

### Patch Changes

- 7229d3c: Resize webinar images

## 0.15.0

### Minor Changes

- df04081: Add Webinar "DevTalk - IO Remote Content"

### Patch Changes

- 88c38bd: Add metadata to webinar page
- 97d1679: [DEV-1545] Add custom PathReporter to improve readability of errors raised by decode

## 0.14.3

### Patch Changes

- b699ba0: Revert "Update video on demand src"

## 0.14.2

### Patch Changes

- 6b2075e: Update video on demand src

## 0.14.1

### Patch Changes

- 3effab5: [DEV-1534] Update webinar end time

## 0.14.0

### Minor Changes

- 24e856a: Change webinars' subscribe button logic
- 5739492: Add SwaggerParameter, SwaggerResponse and SwaggerDescription components

### Patch Changes

- 9bddc42: Fix webinar form and webinar questions page
- 93327c8: Add new Speaker to the PagoPA LAB Webinar
- Updated dependencies [5739492]
  - gitbook-docs@0.1.0

## 0.13.0

### Minor Changes

- de9bbbe: Make the link to the webinar list page visible in the navigation menu also in the production environment
- 1730ae3: Allow fetching from the CMS the hero section of the homepage
- 458c58f: Add the highlight and hide action on webinars' questions list
- 67c66bf: New guide for the use of pagoPA's BO by Technical Partners.

### Patch Changes

- 3bd5661: Handle data-size image attribute to support inline image rendering
- 3c9fbe8: Add test events on webinars and isVisibleInList flag to hide them
- 0db977b: Fix font size in list items
- 6d8f876: Fix webinar banner visibility
- b7ed47f: Removes version from all internal links to redirect to latest guides
- ffde2ad: Reset login form errors on user changes
- Updated dependencies [3bd5661]
  - gitbook-docs@0.0.3

## 0.12.3

### Patch Changes

- 9886edf: Replace images of pagopa-lab webinar

## 0.12.2

### Patch Changes

- 89d164a: Add content for PagoPA LAB first Webinar

## 0.12.1

### Patch Changes

- 6447620: [DPC-160] Fix pagoPA guides and manuals version

## 0.12.0

### Minor Changes

- 9cbc418: Allow fetching from the CMS the "In evidenza" section on the home page

### Patch Changes

- 8144e56: Remove email in url
- 98530ba: Fix Product's description type
- b2dedb0: Fix br parsing
- Updated dependencies [f564577]
- Updated dependencies [b2dedb0]
  - gitbook-docs@0.0.2

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
