import { OverviewPageProps } from '@/app/[productSlug]/overview/page';
import { makeBannerLink } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogo } from './makeProducts';
import { StrapiOverviews } from '@/lib/strapi/types/overviews';

export function makeOverviews(
  strapiOverviews: StrapiOverviews
): ReadonlyArray<OverviewPageProps> {
  return strapiOverviews.data.map(({ attributes }) => {
    return {
      path: `/${attributes.product.data?.attributes.slug}/overview`,
      product: makeBaseProductWithoutLogo(attributes.product.data),
      hero: {
        backgroundImage: attributes.backgroundImage.data.attributes.url,
        altText:
          attributes.backgroundImage.data.attributes.alternativeText || '',
        title: attributes.title,
        subtitle: attributes.subtitle,
      },
      feature:
        (attributes.features && {
          title: attributes.features.title,
          subtitle: attributes.features.subtitle || undefined,
          items:
            attributes.features.items.map((item) => ({
              iconUrl: item.icon.data?.attributes.url,
              content: item.content || undefined,
              title: item.title || '',
            })) || [],
        }) ||
        undefined,
      startInfo:
        (attributes.startInfoSection && {
          title: attributes.startInfoSection.title,
          cta:
            (attributes.startInfoSection.bottomLink && {
              text: attributes.startInfoSection.bottomLabel || '',
              label: attributes.startInfoSection.bottomLink.text,
              href: attributes.startInfoSection.bottomLink.href,
            }) ||
            undefined,
          cards:
            attributes.startInfoSection.items.map((item) => ({
              title: item.title,
              text: item.description,
              href: item.path,
              useSrc: true,
              iconName: item.icon.data.attributes.url,
            })) || [],
        }) ||
        undefined,
      tutorials:
        (attributes.tutorialSection && {
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
              path: `/${tutorial.attributes.product.data.attributes.slug}/tutorials/${tutorial.attributes.slug}`,
            })) || [],
        }) ||
        undefined,
      whatsNew:
        (attributes.whatsNew && {
          title: attributes.whatsNew.title,
          subtitle: attributes.whatsNew.subTitle || undefined,
          ...(attributes.whatsNew.link && {
            link: {
              text: attributes.whatsNew.link.text,
              url: attributes.whatsNew.link.href,
              target: attributes.whatsNew.link.target || undefined,
            },
          }),
          items: attributes.whatsNew.items.data.map((item) => ({
            comingSoon: item.attributes.comingSoon,
            title: item.attributes.title,
            publishedAt: new Date(item.attributes.publishedAt),
            label: item.attributes.label || undefined,
            link: {
              text: item.attributes.link.text,
              url: item.attributes.link.href,
              target: item.attributes.link.target || undefined,
            },
            image: item.attributes.image?.data && {
              url: item.attributes.image.data.attributes.url,
              alternativeText:
                item.attributes.image.data.attributes.alternativeText || '',
            },
          })),
        }) ||
        undefined,
      postIntegration:
        (attributes.postIntegration && {
          title: attributes.postIntegration.title,
          subtitle: attributes.postIntegration.description,
          listTitle: attributes.postIntegration.guidesTitle || undefined,
          cta:
            (attributes.postIntegration.link && {
              label: attributes.postIntegration.link.text,
              href: attributes.postIntegration.link.href,
            }) ||
            undefined,
          guides: [
            ...attributes.postIntegration.documents.map((document) => ({
              title: document.title,
              description: {
                content: document.content,
                title: 'guideListPage.cardSection.listItemsTitle',
                translate: false,
              },
              imagePath: document.image.data.attributes.url,
              mobileImagePath: document.mobileImage.data.attributes.url,
              link: {
                label: document.linkText,
                href: document.linkHref,
                translate: false,
              },
            })),
            ...attributes.postIntegration.guides.data.map((guide) => ({
              title: guide.attributes.title,
              description: {
                listItems: guide.attributes.listItems.map((item) => item.text),
                title: 'guideListPage.cardSection.listItemsTitle',
                translate: false,
              },
              imagePath: guide.attributes.image.data.attributes.url,
              mobileImagePath: guide.attributes.mobileImage.data.attributes.url,
              link: {
                label: 'shared.goToGuide',
                href: `guides/${guide.attributes.slug}`,
                translate: true,
              },
            })),
          ],
          serviceModels: attributes.postIntegration.serviceModels,
        }) ||
        undefined,
      relatedLinks:
        (attributes.relatedLinks && {
          title: attributes.relatedLinks.title || undefined,
          links: attributes.relatedLinks.links.map((link) => ({
            text: link.text,
            href: link.href,
          })),
        }) ||
        undefined,
      bannerLinks:
        attributes.bannerLinks.length > 0
          ? attributes.bannerLinks.map(makeBannerLink)
          : attributes.product.data?.attributes.bannerLinks?.map(
              makeBannerLink
            ),
      seo: attributes.seo || undefined,
    } satisfies OverviewPageProps;
  });
}
