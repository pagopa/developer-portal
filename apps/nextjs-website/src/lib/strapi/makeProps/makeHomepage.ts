import { StrapiHomepage } from '@/lib/strapi/types/homepage';
import { makeWebinarProps } from '@/lib/strapi/makeProps/makeWebinars';
import { HomepageProps } from '@/app/[locale]/page';
import { compact } from 'lodash';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

export const makeHomepageProps = (
  strapiHomepage: RootEntity<StrapiHomepage>
): HomepageProps => ({
  updatedAt: strapiHomepage.data.updatedAt,
  comingsoonDocumentation: strapiHomepage.data.comingsoonDocumentation,
  hero: strapiHomepage.data.heroSlider.map((slide) => ({
    ...slide,
    backgroundImage: slide.backgroundImage,
  })),
  ...(strapiHomepage.data.newsShowcase && {
    newsShowcase: {
      title: strapiHomepage.data.newsShowcase.title,
      items: strapiHomepage.data.newsShowcase.items.map((item) => ({
        comingSoon: item.comingSoon,
        title: item.title,
        publishedAt: new Date(item.publishedAt),
        label: item.label,
        link: {
          text: item.link.text,
          url: item.link.href,
          target: item.link.target,
        },
        image: item.image && item.image,
      })),
    },
  }),
  ...(strapiHomepage.data.ecosystem && {
    ecosystem: {
      title: strapiHomepage.data.ecosystem.title || '',
      productsTabName: strapiHomepage.data.ecosystem.productsTabName,
      products: strapiHomepage.data.ecosystem.products.map((product) => ({
        title: product.name,
        text: product.description ?? '',
        href: `${product.slug}/overview`,
        icon: product.logo?.url || '',
        useSrc: true,
      })),
      solutionsTabName: strapiHomepage.data.ecosystem.solutionsTabName,
      solutions: strapiHomepage.data.ecosystem.solutions.map((solution) => ({
        title: solution.title,
        text: solution.description ?? '',
        href: `/solutions/${solution.slug}`,
        icon: solution.icon.url,
        useSrc: true,
      })),
      solutionsCta: strapiHomepage.data.ecosystem.solutionsCta && {
        variant: strapiHomepage.data.ecosystem.solutionsCta.variant,
        link: strapiHomepage.data.ecosystem.solutionsCta.link,
      },
    },
  }),
  seo: strapiHomepage.data?.seo,
  webinars: compact(
    strapiHomepage.data.webinars.map((webinar) => makeWebinarProps(webinar))
  ),
});
