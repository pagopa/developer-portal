import { StrapiOverviews } from '@/lib/strapi/overviewsCodec';
import { OverviewPageProps } from '@/app/[productSlug]/overview/page';
import { overviews, products } from '@/_contents/products';

type StaticOverviews = typeof overviews;

export function makeOverviewsProps(
  strapiOverviews: StrapiOverviews,
  staticOverviews: StaticOverviews
): ReadonlyArray<OverviewPageProps> {
  return [
    ...strapiOverviews.data.map(({ attributes }) => {
      // TODO: Remove this constant once the product is managed by the CMS
      const product =
        products.find(
          ({ slug }) => slug === attributes.product.data?.attributes.slug
        ) || products[0];

      return {
        path: `/${product?.slug}/overview`,
        product,
        hero: {
          backgroundImage: attributes.backgroundImage.data.attributes.url,
          altText:
            attributes.backgroundImage.data.attributes.alternativeText || '',
          title: attributes.title,
          subtitle: attributes.subtitle,
        },
        feature: attributes.features && {
          title: attributes.features.title,
          subtitle: attributes.features.subtitle,
          items:
            attributes.features.items.map((item) => ({
              iconUrl: item.icon.data?.attributes.url,
              subtitle: item.subtitle,
              content: item.content,
              title: item.title || '',
            })) || [],
        },
        startInfo: attributes.startInfoSection && {
          title: attributes.startInfoSection.title,
          cta: attributes.startInfoSection.bottomLink && {
            text: attributes.startInfoSection.bottomLabel || '',
            label: attributes.startInfoSection.bottomLink.text,
            href: attributes.startInfoSection.bottomLink.href,
          },
          cards:
            attributes.startInfoSection.items.map((item) => ({
              title: item.title,
              text: item.description,
              href: item.path,
              isSvg: true,
              iconName: item.icon.data.attributes.url,
            })) || [],
        },
        tutorials: attributes.tutorialSection && {
          title: attributes.tutorialSection.title,
          subtitle: attributes.tutorialSection.description,
          list:
            attributes.tutorialSection.tutorials.data.map((tutorial) => ({
              showInOverview: true,
              image: tutorial.attributes.image.data
                ? {
                    url: tutorial.attributes.image.data.attributes.url,
                    alternativeText:
                      tutorial.attributes.image.data.attributes
                        .alternativeText || '',
                  }
                : undefined,
              title: tutorial.attributes.title,
              name: 'shared.moreInfo', // This is a reference to a translation key
              path: tutorial.attributes.slug,
            })) || [],
        },
        postIntegration: attributes.postIntegration && {
          title: attributes.postIntegration.title,
          subtitle: attributes.postIntegration.description,
          listTitle: attributes.postIntegration.guidesTitle,
          cta: {
            label: attributes.postIntegration.link?.text || '',
            href: attributes.postIntegration.link?.href || '',
          },
          guides: [
            ...attributes.postIntegration.documents.map((document) => ({
              title: document.title,
              description: {
                content: document.content,
                title: 'guideListPage.cardSection.listItemsTitle',
              },
              imagePath: document.image.data.attributes.url,
              mobileImagePath: document.mobileImage.data.attributes.url,
              link: {
                label: document.linkText,
                href: document.linkHref,
              },
            })),
            ...attributes.postIntegration.guides.data.map((guide) => ({
              title: guide.attributes.title,
              description: {
                listItems: guide.attributes.listItems.map((item) => item.text),
                title: 'guideListPage.cardSection.listItemsTitle',
              },
              imagePath: guide.attributes.image.data.attributes.url,
              mobileImagePath: guide.attributes.mobileImage.data.attributes.url,
              link: {
                label: 'shared.goToModel',
                href: `guides/${guide.attributes.slug}`,
              },
            })),
          ],
          serviceModels: attributes.postIntegration.serviceModels,
        },
        relatedLinks: attributes.relatedLinks && {
          title: attributes.relatedLinks.title,
          links: attributes.relatedLinks.links,
        },
        bannerLinks: [
          ...attributes.bannerLinks.map((bannerLink) => ({
            content: bannerLink.content,
            icon: bannerLink.icon.data.attributes,
            theme: bannerLink.theme || 'dark',
            title: bannerLink.title || '',
          })),
        ],
      };
    }),
    ...staticOverviews,
  ];
}
