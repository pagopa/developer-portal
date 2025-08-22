import { StrapiOverviews } from '@/lib/strapi/codecs/OverviewsCodec';
import { OverviewPageProps } from '@/app/[locale]/[productSlug]/overview/page';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from './makeProducts';

export function makeOverviewsProps(
  strapiOverviews: StrapiOverviews
): ReadonlyArray<OverviewPageProps> {
  return strapiOverviews.data.map(({ attributes }) => {
    return {
      path: `/${attributes.product.data?.attributes.slug}/overview`,
      product: makeBaseProductWithoutLogoProps(attributes.product.data),
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
            useSrc: true,
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
                    tutorial.attributes.image.data.attributes.alternativeText ||
                    '',
                }
              : undefined,
            title: tutorial.attributes.title,
            name: 'shared.moreInfo', // This is a reference to a translation key
            path: `/${tutorial.attributes.product.data.attributes.slug}/tutorials/${tutorial.attributes.slug}`,
          })) || [],
      },
      whatsNew: attributes.whatsNew && {
        title: attributes.whatsNew.title,
        subtitle: attributes.whatsNew.subTitle,
        ...(attributes.whatsNew.link && {
          link: {
            text: attributes.whatsNew.link.text,
            url: attributes.whatsNew.link.href,
            target: attributes.whatsNew.link.target,
          },
        }),
        items: attributes.whatsNew.items.data.map((item) => ({
          comingSoon: item.attributes.comingSoon,
          title: item.attributes.title,
          publishedAt: item.attributes.publishedAt,
          label: item.attributes.label,
          link: {
            text: item.attributes.link.text,
            url: item.attributes.link.href,
            target: item.attributes.link.target,
          },
          image:
            item.attributes.image.data && item.attributes.image.data.attributes,
        })),
      },
      postIntegration: attributes.postIntegration && {
        title: attributes.postIntegration.title,
        subtitle: attributes.postIntegration.description,
        listTitle: attributes.postIntegration.guidesTitle,
        cta: attributes.postIntegration.link && {
          label: attributes.postIntegration.link.text,
          href: attributes.postIntegration.link.href,
        },
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
      },
      relatedLinks: attributes.relatedLinks && {
        title: attributes.relatedLinks.title,
        links: attributes.relatedLinks.links,
      },
      bannerLinks:
        attributes.bannerLinks.length > 0
          ? attributes.bannerLinks.map(makeBannerLinkProps)
          : attributes.product.data?.attributes.bannerLinks?.map(
              makeBannerLinkProps
            ),
      seo: attributes.seo,
    };
  });
}
