import { StrapiHomepage } from '@/lib/strapi/types/homepage';
import { makeWebinarProps } from '@/lib/strapi/makeProps/makeWebinars';
import { HomepageProps } from '@/app/page';
import { compact } from 'lodash';

export const makeHomepageProps = (
  strapiHomepage: StrapiHomepage
): HomepageProps => ({
  comingsoonDocumentation: strapiHomepage.comingsoonDocumentation,
  hero: strapiHomepage.heroSlider.map((slide) => ({
    ...slide,
    backgroundImage: slide.backgroundImage,
  })),
  ...(strapiHomepage.newsShowcase && {
    newsShowcase: {
      title: strapiHomepage.newsShowcase.title,
      items: strapiHomepage.newsShowcase.items.map((item) => ({
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
  ...(strapiHomepage.ecosystem && {
    ecosystem: {
      title: strapiHomepage.ecosystem.title || '',
      productsTabName: strapiHomepage.ecosystem.productsTabName,
      products: strapiHomepage.ecosystem.products.map((product) => ({
        title: product.name,
        text: product.description ?? '',
        href: `${product.slug}/overview`,
        icon: product.logo?.url || '',
        useSrc: true,
      })),
      solutionsTabName: strapiHomepage.ecosystem.solutionsTabName,
      solutions: strapiHomepage.ecosystem.solutions.map((solution) => ({
        title: solution.title,
        text: solution.description ?? '',
        href: `/solutions/${solution.slug}`,
        icon: solution.icon.url,
        useSrc: true,
      })),
      solutionsCta: strapiHomepage.ecosystem.solutionsCta && {
        variant: strapiHomepage.ecosystem.solutionsCta.variant,
        link: strapiHomepage.ecosystem.solutionsCta.link,
      },
    },
  }),
  seo: strapiHomepage?.seo,
  webinars: compact(
    strapiHomepage.webinars.map((webinar) => makeWebinarProps(webinar))
  ),
});
