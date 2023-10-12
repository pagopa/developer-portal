# How To: Add a new GitBook docs

## Assumptions

The GitBook space is synchronized on [devportal-docs](https://github.com/pagopa/devportal-docs/tree/docs/from-gitbook) repository and the steps of [How To: Update GitBook docs](update-gitbook-docs.md) are completed.

## Add a new version to manuale dei servizi of AppIO

### Steps

1. Open `/apps/nextjs-website/src/_contents/appIo/guides.ts`
2. Identify the guide to update (in this example `manualeDeiServizi`)
3. Add a new element on `versions` array:
``` typescript
// ... other stuff ...

const manualeDeiServizi: GuideDefinition = {
  product: appIo,
  guide: {
    name: "Manuale dei servizi dell'app IO",
    slug: 'manuale-servizi',
  },
  versions: [
    // this is the added version!
    {
      version: 'v1.2',
      // The dirName is the name of the folder where
      // the GitBook space is synchronized
      dirName: 'the-dir-name',
    },
    // the below version was already there
    {
      version: 'v1.1',
      dirName: 'VjpCR0JtTGTN9pAUoAg3',
    },
    {
      version: 'v1.0',
      dirName: 'zcLztiq5qDSVw9rRjW7p',
    },
  ],
  bannerLinks: appIoBannerLinks,
};

// ... other stuff ...
```

## Add a new guide named "Nuova guida per gli enti" to AppIO

### Steps

1. Open `/apps/nextjs-website/src/_contents/appIo/guides.ts`
2. Add a new `const` which defines the new `guide`:
```typescript
// ... other stuff ...

// this is the new guide!
const nuovaGuidaPerGliEnti: GuideDefinition = {
  product: appIo,
  guide: {
    name: "Nuova guida per gli enti",
    slug: 'nuova-guida-per-gli-enti',
  },
  versions: [
    {
      version: 'v1.0',
      dirName: 'zcLltia5qDSVw1rRjw7o',
    },
  ],
  bannerLinks: appIoBannerLinks,
};

// ... other stuff ...
```
3. In the same file `/apps/nextjs-website/src/_contents/appIo/guides.ts` add the new guide to `appIoGuides` array:
```typescript
// ... other stuff ...

export const appIoGuides = [
  guidaTecnica,
  manualeDeiServizi,
  supportoAgliEnti,
  kitDiComunicazione,
  cartaGiovani,
  // the new guide ---v
  nuovaGuidaPerGliEnti,
];
```
