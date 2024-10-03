import { StrapiTutorials } from '../codecs/TutorialCodec';
import { Part } from '../../types/part';
import { Tutorial } from '../../types/tutorialData';
import { makePartProps } from '@/lib/strapi/makeProps/makePart';

export type TutorialsProps = readonly (Tutorial & {
  readonly productSlug: string;
  readonly relatedLinks?: StrapiTutorials['data'][0]['attributes']['relatedLinks'];
  readonly bannerLinks?: StrapiTutorials['data'][0]['attributes']['bannerLinks'];
})[];

export function makeTutorialsProps(
  strapiTutorials: StrapiTutorials,
  productSlug?: string
): TutorialsProps {
  const tutorialsProps = strapiTutorials.data.map(({ attributes }) => ({
    showInOverview: false, // TODO: remove this when overview data are fetched from Strapi
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
    parts: [
      ...(attributes.parts
        .map((part) => makePartProps(part))
        .filter((part) => !!part) as ReadonlyArray<Part>),
    ],
    productSlug: attributes.product.data.attributes.slug,
    relatedLinks: attributes.relatedLinks,
    bannerLinks: attributes.bannerLinks,
    seo: attributes.seo,
  }));

  return productSlug
    ? tutorialsProps.filter((tutorial) => tutorial.productSlug === productSlug)
    : tutorialsProps;
}
