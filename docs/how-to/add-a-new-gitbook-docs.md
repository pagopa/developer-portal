# How To: Add a new GitBook docs

## Add a new version to manuale dei servizi of AppIO

### Assumptions

The GitBook space is synchronized on [devportal-docs](https://github.com/pagopa/devportal-docs/tree/docs/from-gitbook) repository and the steps of [How To: Update GitBook docs](update-gitbook-docs.md) are completed.

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
