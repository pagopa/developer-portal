import { StrapiTutorials } from '../codecs/TutorialCodec';
import { Part } from '../../types/part';
import { Tutorial } from '../../types/tutorialData';
import { makePartProps } from '@/lib/strapi/makeProps/makePart';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { RelatedLinksProps } from '@/components/atoms/RelatedLinks/RelatedLinks';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithRelationsCodec } from './makeProducts';

export type TutorialsProps = readonly (Tutorial & {
  readonly productSlug: string;
  readonly relatedLinks?: RelatedLinksProps;
  readonly bannerLinks?: readonly BannerLinkProps[];
})[];

export function makeTutorialsProps(
  strapiTutorials: StrapiTutorials,
  productSlug?: string
): TutorialsProps {
  const tutorialsProps = strapiTutorials.data.map(({ attributes }) => ({
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
    product: makeBaseProductWithRelationsCodec(attributes.product.data),
    productSlug: attributes.product.data.attributes.slug,
    relatedLinks: attributes.relatedLinks,
    bannerLinks:
      attributes.bannerLinks && attributes.bannerLinks.length > 0
        ? attributes.bannerLinks?.map(makeBannerLinkProps)
        : attributes.product.data?.attributes.bannerLinks?.map(
            makeBannerLinkProps
          ),
    seo: attributes.seo,
  }));

  return productSlug
    ? tutorialsProps.filter((tutorial) => tutorial.productSlug === productSlug)
    : tutorialsProps;
}
