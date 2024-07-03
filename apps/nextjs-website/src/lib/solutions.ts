import { StrapiSolutions } from './strapi/solutionsCodec';
import { SolutionPageTemplateProps } from '@/components/templates/SolutionPageTemplate/SolutionPageTemplate';

export function makeSolutionsProps(
  strapiSolutions: StrapiSolutions
): ReadonlyArray<SolutionPageTemplateProps> {
  return strapiSolutions.data.map(({ attributes }) => ({
    ...attributes,
    steps: attributes.steps.map((step) => ({
      ...step,
      products: attributes.products.data.map((product) => ({
        name: product.attributes.name,
        slug: product.attributes.slug,
      })),
    })),
    products: attributes.products.data.map(({ attributes }) => ({
      ...attributes,
      logo: attributes.logo.data.attributes,
    })),
    icon: attributes.icon.data.attributes,
    webinars: attributes.webinars.data.map((webinar) => ({
      ...webinar.attributes,
      startDateTime: webinar.attributes.startDatetime?.toISOString(),
      endDateTime: webinar.attributes.endDatetime?.toISOString(),
      imagePath: webinar.attributes.coverImage.data.attributes.url,
      speakers: webinar.attributes.webinarSpeakers.data.map((speaker) => ({
        ...speaker.attributes,
        avatar: speaker.attributes.avatar.data?.attributes,
      })),
    })),
    bannerLinks: attributes.bannerLinks.map((bannerLink) => ({
      ...bannerLink,
      title: bannerLink.title || '',
      icon: bannerLink.icon?.data?.attributes,
    })),
  }));
}
