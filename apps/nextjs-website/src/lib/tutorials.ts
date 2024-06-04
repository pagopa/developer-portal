import { StrapiTutorials } from './strapi/tutorial';
import { Tutorial } from './types/tutorialData';

export type TutorialsProps = readonly (Tutorial & {
  readonly productSlug: string;
  readonly relatedLinks?: StrapiTutorials['data'][0]['attributes']['relatedLinks'];
  readonly bannerLinks?: StrapiTutorials['data'][0]['attributes']['bannerLinks'];
})[];

export function makeTutorialsProps(
  strapiTutorials: StrapiTutorials
): TutorialsProps {
  return strapiTutorials.data.map(({ attributes }) => ({
    comingSoon: false, // TODO: add this field to the Strapi model
    showInOverview: true, // TODO: add this field to the Strapi model
    image: attributes.image.data
      ? {
          url: attributes.image.data.attributes.url,
          alternativeText:
            attributes.image.data.attributes.alternativeText || '',
        }
      : undefined,
    title: attributes.title,
    publishedAt: attributes.publishedAt,
    name: attributes.title,
    path: `/${attributes.product.data.attributes.slug}/tutorials/${attributes.slug}`,
    content: attributes.content,
    productSlug: attributes.product.data.attributes.slug,
    relatedLinks: attributes.relatedLinks,
    bannerLinks: attributes.bannerLinks,
  }));
}
