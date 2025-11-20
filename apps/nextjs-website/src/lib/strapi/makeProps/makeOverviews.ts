/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { OverviewPageProps } from '@/app/[productSlug]/overview/page';
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
      const productData = attributes.product.data;
      if (!productData.slug) {
        console.error(
          `Error while processing Overview with title "${attributes.title}": missing product slug. Skipping...`
        );
        return null;
      }

      try {
        return {
          path: `/${attributes.product.data?.slug}/overview`,
          product: makeBaseProductWithoutLogoProps(attributes.product.data),
          hero: {
            backgroundImage: attributes.backgroundImage.data.url,
            altText: attributes.backgroundImage.data.alternativeText || '',
            title: attributes.title,
            subtitle: attributes.subtitle,
          },
          feature: attributes.features && {
            title: attributes.features.title,
            subtitle: attributes.features.subtitle,
            items:
              attributes.features.items.map((item) => ({
                iconUrl: item.icon.data?.url,
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
                iconName: item.icon.data.url,
              })) || [],
          },
          tutorials: attributes.tutorialSection && {
            title: attributes.tutorialSection.title,
            subtitle: attributes.tutorialSection.description,
            showCardsLayout: attributes.tutorialSection.showCardsLayout,
            list:
              compact(
                attributes.tutorialSection.tutorials.data.map((tutorial) => {
                  if (!tutorial.slug) {
                    console.error('tutorial slug is missing:', tutorial.title);
                    return null;
                  }

                  if (!tutorial.product.data.slug) {
                    console.error(
                      "tutorial's product slug is missing:",
                      tutorial.title
                    );
                    return null;
                  }
                  return {
                    icon: tutorial.icon.data,
                    description: tutorial.description,
                    showInOverview: true,
                    image: tutorial.image.data && {
                      url: tutorial.image.data.url,
                      alternativeText:
                        tutorial.image.data.alternativeText || '',
                    },
                    title: tutorial.title,
                    name: 'shared.moreInfo',
                    path: `/${tutorial.product.data.slug}/tutorials/${tutorial.slug}`,
                  };
                })
              ) || [],
          },
          useCases: attributes.useCaseSection && {
            title: attributes.useCaseSection.title,
            description: attributes.useCaseSection.description,
            list:
              compact(
                attributes.useCaseSection.useCases.data.map((useCase) => {
                  if (!useCase.slug) {
                    console.error('use case slug is missing:', useCase.title);
                    return null;
                  }

                  if (!useCase.product.data.slug) {
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
                    coverImage: useCase.coverImage.data && {
                      url: useCase.coverImage.data.url,
                      alternativeText:
                        useCase.coverImage.data.alternativeText || '',
                    },
                    title: useCase.title,
                    name: 'shared.moreInfo',
                    path: `/${useCase.product.data.slug}/use-cases/${useCase.slug}`,
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
            items: attributes.whatsNew.items.data.map((item) => ({
              comingSoon: item.comingSoon,
              title: item.title,
              publishedAt: new Date(item.publishedAt),
              label: item.label,
              link: {
                text: item.link.text,
                url: item.link.href,
                target: item.link.target,
              },
              image: item.image?.data && {
                url: item.image.data.url,
                alternativeText: item.image.data.alternativeText || '',
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
                imagePath: document.image.data.url,
                mobileImagePath: document.mobileImage.data.url,
                link: {
                  label: document.linkText,
                  href: document.linkHref,
                  translate: false,
                },
              })),
              ...compact(
                attributes.postIntegration.guides.data.map((guide) => {
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
                    imagePath: guide.image.data.url,
                    mobileImagePath: guide.mobileImage.data.url,
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
              : attributes.product.data?.bannerLinks?.map(makeBannerLinkProps),
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
