/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { OverviewPageProps } from '@/app/[locale]/[productSlug]/overview/page';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from './makeProducts';
import { StrapiOverviews } from '@/lib/strapi/types/overviews';
import { compact } from 'lodash';
import { UseCase } from '../../types/useCaseData';

export function makeOverviewsProps(
  strapiOverviews: StrapiOverviews
): ReadonlyArray<OverviewPageProps> {
  return compact(
    strapiOverviews.data.map((attributes) => {
      const productData = attributes.product;
      if (!productData.slug) {
        console.error(
          `Error while processing Overview with title "${attributes.title}": missing product slug. Skipping...`
        );
        return null;
      }

      try {
        return {
          updatedAt: attributes.updatedAt,
          path: `/${attributes.product?.slug}/overview`,
          product: makeBaseProductWithoutLogoProps(attributes.product),
          hero: {
            backgroundImage: attributes.backgroundImage.url,
            altText: attributes.backgroundImage.alternativeText || '',
            title: attributes.title,
            subtitle: attributes.subtitle,
          },
          feature: attributes.features && {
            title: attributes.features.title,
            subtitle: attributes.features.subtitle,
            items:
              attributes.features.items.map((item) => ({
                iconUrl: item.icon?.url,
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
                iconName: item.icon.url,
              })) || [],
          },
          tutorials: attributes.tutorialSection && {
            title: attributes.tutorialSection.title,
            subtitle: attributes.tutorialSection.description,
            showCardsLayout: attributes.tutorialSection.showCardsLayout,
            list:
              compact(
                attributes.tutorialSection.tutorials.map((tutorial) => {
                  if (!tutorial.slug) {
                    console.error('tutorial slug is missing:', tutorial.title);
                    return null;
                  }

                  if (!tutorial.product?.slug) {
                    console.error(
                      "tutorial's product slug is missing:",
                      tutorial.title
                    );
                    return null;
                  }
                  return {
                    icon: tutorial.icon,
                    description: tutorial.description,
                    showInOverview: true,
                    updatedAt: tutorial.updatedAt,
                    image: tutorial.image && {
                      url: tutorial.image.url,
                      alternativeText: tutorial.image.alternativeText || '',
                    },
                    title: tutorial.title,
                    name: 'shared.moreInfo',
                    path: `/${tutorial.product.slug}/tutorials/${tutorial.slug}`,
                  };
                })
              ) || [],
          },
          useCases: attributes.useCaseSection && {
            title: attributes.useCaseSection.title,
            description: attributes.useCaseSection.description,
            list:
              compact(
                attributes.useCaseSection.useCases.map((useCase) => {
                  if (!useCase.slug) {
                    console.error('use case slug is missing:', useCase.title);
                    return null;
                  }

                  if (!useCase.product.slug) {
                    console.error(
                      "use case's product slug is missing:",
                      useCase.title
                    );
                    return null;
                  }

                  return {
                    publishedAt:
                      (useCase.publishedAt && new Date(useCase.publishedAt)) ||
                      undefined,
                    showInOverview: true,
                    coverImage: useCase.coverImage && {
                      url: useCase.coverImage.url,
                      alternativeText: useCase.coverImage.alternativeText || '',
                    },
                    title: useCase.title,
                    name: 'shared.moreInfo',
                    path: `/${useCase.product.slug}/use-cases/${useCase.slug}`,
                  } satisfies UseCase;
                })
              ) || [],
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
            items: attributes.whatsNew.items.map((item) => ({
              comingSoon: item.comingSoon,
              title: item.title,
              publishedAt: new Date(item.publishedAt),
              label: item.label,
              link: {
                text: item.link.text,
                url: item.link.href,
                target: item.link.target,
              },
              image: item.image && {
                url: item.image.url,
                alternativeText: item.image.alternativeText || '',
              },
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
                imagePath: document.image.url,
                mobileImagePath: document.mobileImage.url,
                link: {
                  label: document.linkText,
                  href: document.linkHref,
                  translate: false,
                },
              })),
              ...compact(
                attributes.postIntegration.guides.map((guide) => {
                  if (!guide.slug) {
                    console.error(
                      "post-integration guide's product slug is missing:",
                      guide
                    );
                    return null;
                  }

                  return {
                    title: guide.title,
                    description: {
                      listItems: guide.listItems.map((item) => item.text),
                      title: 'guideListPage.cardSection.listItemsTitle',
                      translate: false,
                    },
                    imagePath: guide.image.url,
                    mobileImagePath: guide.mobileImage.url,
                    link: {
                      label: 'shared.goToGuide',
                      href: `guides/${guide.slug}`,
                      translate: true,
                    },
                  };
                })
              ),
            ],
            serviceModels: attributes.postIntegration.serviceModels,
          },
          relatedLinks: attributes.relatedLinks && {
            title: attributes.relatedLinks.title,
            links: attributes.relatedLinks.links.map((link) => ({
              text: link.text,
              href: link.href,
            })),
          },
          bannerLinks:
            attributes.bannerLinks.length > 0
              ? attributes.bannerLinks.map(makeBannerLinkProps)
              : attributes.product?.bannerLinks?.map(makeBannerLinkProps),
          seo: attributes.seo,
        } satisfies OverviewPageProps;
      } catch (error) {
        console.error(
          `Error processing Overview for product: "${productData.name}":`,
          error
        );
        return null;
      }
    })
  );
}
