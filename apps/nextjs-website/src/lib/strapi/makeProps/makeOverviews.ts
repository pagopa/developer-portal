/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { OverviewPageProps } from '@/app/[locale]/[productSlug]/overview/page';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from './makeProducts';
import { StrapiOverviews } from '@/lib/strapi/types/overviews';
import { compact } from 'lodash';
import { UseCase } from '../../types/useCaseData';

export function makeOverviewsProps(
  locale: string,
  strapiOverviews: StrapiOverviews
): ReadonlyArray<OverviewPageProps> {
  return compact(
    strapiOverviews.data.map(({ attributes }) => {
      const productData = attributes.product.data;
      if (!productData.attributes.slug) {
        console.error(
          `Error while processing Overview with title "${attributes.title}": missing product slug. Skipping...`
        );
        return null;
      }

      try {
        return {
          updatedAt: attributes.updatedAt,
          path: `/${locale}/${attributes.product.data?.attributes.slug}/overview`,
          product: makeBaseProductWithoutLogoProps(
            locale,
            attributes.product.data
          ),
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
            showCardsLayout: attributes.tutorialSection.showCardsLayout,
            list:
              compact(
                attributes.tutorialSection.tutorials.data.map((tutorial) => {
                  if (!tutorial.attributes.slug) {
                    console.error(
                      'tutorial slug is missing:',
                      tutorial.attributes.title
                    );
                    return null;
                  }

                  if (!tutorial.attributes.product.data.attributes.slug) {
                    console.error(
                      "tutorial's product slug is missing:",
                      tutorial.attributes.title
                    );
                    return null;
                  }
                  return {
                    updatedAt: tutorial.attributes.updatedAt,
                    icon: tutorial.attributes.icon.data?.attributes,
                    description: tutorial.attributes.description,
                    showInOverview: true,
                    image: tutorial.attributes.image.data && {
                      url: tutorial.attributes.image.data.attributes.url,
                      alternativeText:
                        tutorial.attributes.image.data.attributes
                          .alternativeText || '',
                    },
                    title: tutorial.attributes.title,
                    name: 'shared.moreInfo',
                    path: `${locale}/${tutorial.attributes.product.data.attributes.slug}/tutorials/${tutorial.attributes.slug}`,
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
                  if (!useCase.attributes.slug) {
                    console.error(
                      'use case slug is missing:',
                      useCase.attributes.title
                    );
                    return null;
                  }

                  if (!useCase.attributes.product.data.attributes.slug) {
                    console.error(
                      "use case's product slug is missing:",
                      useCase.attributes.title
                    );
                    return null;
                  }

                  return {
                    publishedAt:
                      (useCase.attributes.publishedAt &&
                        new Date(useCase.attributes.publishedAt)) ||
                      undefined,
                    showInOverview: true,
                    coverImage: useCase.attributes.coverImage.data && {
                      url: useCase.attributes.coverImage.data.attributes.url,
                      alternativeText:
                        useCase.attributes.coverImage.data.attributes
                          .alternativeText || '',
                    },
                    title: useCase.attributes.title,
                    name: 'shared.moreInfo',
                    path: `${locale}/${useCase.attributes.product.data.attributes.slug}/use-cases/${useCase.attributes.slug}`,
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
              comingSoon: item.attributes.comingSoon,
              title: item.attributes.title,
              publishedAt: new Date(item.attributes.publishedAt),
              label: item.attributes.label,
              link: {
                text: item.attributes.link.text,
                url: item.attributes.link.href,
                target: item.attributes.link.target,
              },
              image: item.attributes.image?.data && {
                url: item.attributes.image.data.attributes.url,
                alternativeText:
                  item.attributes.image.data.attributes.alternativeText || '',
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
                imagePath: document.image.data.attributes.url,
                mobileImagePath: document.mobileImage.data.attributes.url,
                link: {
                  label: document.linkText,
                  href: document.linkHref,
                  translate: false,
                },
              })),
              ...compact(
                attributes.postIntegration.guides.data.map((guide) => {
                  if (!guide.attributes.slug) {
                    console.error(
                      "post-integration guide's product slug is missing:",
                      guide.attributes
                    );
                    return null;
                  }

                  return {
                    title: guide.attributes.title,
                    description: {
                      listItems: guide.attributes.listItems.map(
                        (item) => item.text
                      ),
                      title: 'guideListPage.cardSection.listItemsTitle',
                      translate: false,
                    },
                    imagePath: guide.attributes.image.data.attributes.url,
                    mobileImagePath:
                      guide.attributes.mobileImage.data.attributes.url,
                    link: {
                      label: 'shared.goToGuide',
                      href: `guides/${guide.attributes.slug}`,
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
              : attributes.product.data?.attributes.bannerLinks?.map(
                  makeBannerLinkProps
                ),
          seo: attributes.seo,
        } satisfies OverviewPageProps;
      } catch (error) {
        console.error(
          `Error processing Overview for product: "${productData.attributes.name}":`,
          error
        );
        return null;
      }
    })
  );
}
