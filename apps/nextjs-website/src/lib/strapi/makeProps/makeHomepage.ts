import { StrapiHomepage } from '@/lib/strapi/types/homepage';
import { makeWebinarProps } from '@/lib/strapi/makeProps/makeWebinars';
import { HomepageProps } from '@/app/page';
import { compact } from 'lodash';

export const makeHomepageProps = (
  strapiHomepage: StrapiHomepage
): HomepageProps => ({
  comingsoonDocumentation: strapiHomepage.data.comingsoonDocumentation,
  hero: strapiHomepage.data.heroSlider.map((slide) => ({
    ...slide,
    backgroundImage: slide.backgroundImage?.data,
  })),
  ...(strapiHomepage.data.newsShowcase && {
    newsShowcase: {
      title: strapiHomepage.data.newsShowcase.title,
      items: strapiHomepage.data.newsShowcase.items.data.map((item) => ({
        comingSoon: item.comingSoon,
        title: item.title,
        publishedAt: new Date(item.publishedAt),
        label: item.label,
        link: {
          text: item.link.text,
          url: item.link.href,
          target: item.link.target,
        },
        image: item.image?.data && item.image.data,
      })),
    },
  }),
  ...(strapiHomepage.data.ecosystem && {
    ecosystem: {
      title: strapiHomepage.data.ecosystem.title || '',
      productsTabName: strapiHomepage.data.ecosystem.productsTabName,
      products: strapiHomepage.data.ecosystem.products.data.map((product) => ({
        title: product.name,
        text: product.description ?? '',
        href: `${product.slug}/overview`,
        icon: product.logo.data?.url || '',
        useSrc: true,
      })),
      solutionsTabName: strapiHomepage.data.ecosystem.solutionsTabName,
      solutions: strapiHomepage.data.ecosystem.solutions.data.map(
        (solution) => ({
          title: solution.title,
          text: solution.description ?? '',
          href: `/solutions/${solution.slug}`,
          icon: solution.icon.data.url,
          useSrc: true,
        })
      ),
      solutionsCta: strapiHomepage.data.ecosystem.solutionsCta && {
        variant: strapiHomepage.data.ecosystem.solutionsCta.variant,
        link: strapiHomepage.data.ecosystem.solutionsCta.link,
      },
    },
  }),
  seo: strapiHomepage?.data?.seo,
  webinars: compact(
    strapiHomepage.data.webinars.data.map((webinar) =>
      makeWebinarProps(webinar)
    )
  ),
});
