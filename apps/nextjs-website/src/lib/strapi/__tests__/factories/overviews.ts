/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrapiOverviews } from '@/lib/strapi/types/overviews';
import { strapiOverviews } from '@/lib/strapi/__tests__/fixtures/overviews';

export function minimalDataSingleOverview(): StrapiOverviews {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.data[0],
        attributes: {
          ...strapiOverviews.data[0].attributes,
          features: undefined,
          startInfoSection: undefined,
          tutorialSection: undefined,
          whatsNew: undefined,
          postIntegration: undefined,
          relatedLinks: undefined,
          seo: undefined
        }
      }
    ]
  };
}

export function overviewsWithItemWithEmptyProductSlug() {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.data[0],
        attributes: {
          ...strapiOverviews.data[0].attributes,
          product: {
            data: {
              ...strapiOverviews.data[0].attributes.product.data,
              attributes: {
                ...strapiOverviews.data[0].attributes.product.data.attributes,
                slug: ''
              }
            }
          }
        }
      }
    ]
  };
}

export function overviewsWithItemMissingProductSlug() {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.data[0],
        attributes: {
          ...strapiOverviews.data[0].attributes,
          product: {
            data: {
              ...strapiOverviews.data[0].attributes.product.data,
              attributes: {
                ...strapiOverviews.data[0].attributes.product.data.attributes,
                slug: undefined as any
              }
            }
          }
        }
      }
    ]
  };
}

export function overviewsWithItemMissingTutorialProductSlug() {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.data[0],
        attributes: {
          ...strapiOverviews.data[0].attributes,
          tutorialSection: {
            ...strapiOverviews.data[0].attributes.tutorialSection,
            tutorials: {
              data: [
                {
                  ...strapiOverviews.data[0].attributes.tutorialSection
                    .tutorials.data[0],
                  attributes: {
                    ...strapiOverviews.data[0].attributes.tutorialSection
                      .tutorials.data[0].attributes,
                    product: {
                      data: {
                        ...strapiOverviews.data[0].attributes.tutorialSection
                          .tutorials.data[0].attributes.product.data,
                        attributes: {
                          ...strapiOverviews.data[0].attributes.tutorialSection
                            .tutorials.data[0].attributes.product.data
                            .attributes,
                          slug: undefined as any
                        }
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      }
    ]
  };
}

export function overviewsWithItemMissingTutorialSlug() {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.data[0],
        attributes: {
          ...strapiOverviews.data[0].attributes,
          tutorialSection: {
            ...strapiOverviews.data[0].attributes.tutorialSection,
            tutorials: {
              data: [
                {
                  ...strapiOverviews.data[0].attributes.tutorialSection
                    .tutorials.data[0],
                  attributes: {
                    ...strapiOverviews.data[0].attributes.tutorialSection
                      .tutorials.data[0].attributes,
                    slug: undefined as any
                  }
                }
              ]
            }
          }
        }
      }
    ]
  };
}

export function overviewsWithItemWithEmptyGuideProductSlug() {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.data[0],
        attributes: {
          ...strapiOverviews.data[0].attributes,
          postIntegration: {
            ...strapiOverviews.data[0].attributes.postIntegration,
            guides: {
              data: [
                {
                  ...strapiOverviews.data[0].attributes.postIntegration.guides
                    .data[0],
                  attributes: {
                    ...strapiOverviews.data[0].attributes.postIntegration.guides
                      .data[0].attributes,
                    slug: ''
                  }
                }
              ]
            }
          }
        }
      }
    ]
  };
}

export function overviewsWithItemMissingGuideProductSlug() {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.data[0],
        attributes: {
          ...strapiOverviews.data[0].attributes,
          postIntegration: {
            ...strapiOverviews.data[0].attributes.postIntegration,
            guides: {
              data: [
                {
                  ...strapiOverviews.data[0].attributes.postIntegration.guides
                    .data[0],
                  attributes: {
                    ...strapiOverviews.data[0].attributes.postIntegration.guides
                      .data[0].attributes,
                    slug: undefined as any
                  }
                }
              ]
            }
          }
        }
      }
    ]
  };
}
