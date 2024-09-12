import { StrapiHomepage } from '@/lib/strapi/codecs/HomepageCodec';
import { translations } from '@/_contents/translations';
import { makeWebinarFromStrapi } from './makeWebinars';
import { HomepageProps } from '@/app/page';

type StaticHomepage = typeof translations.homepage;

export const makeHomepageProps = (
  strapiHomepage: StrapiHomepage,
  staticHomepage: StaticHomepage
): HomepageProps => ({
  ...makeHomepagePropsFromStatic(staticHomepage),
  comingsoonDocumentation:
    strapiHomepage.data.attributes.comingsoonDocumentation,
  hero: strapiHomepage.data.attributes.heroSlider.map((slide) => ({
    ...slide,
    backgroundImage: slide.backgroundImage?.data?.attributes,
  })),
  ...(strapiHomepage.data.attributes.newsShowcase && {
    newsShowcase: {
      title: strapiHomepage.data.attributes.newsShowcase.title,
      items: strapiHomepage.data.attributes.newsShowcase.items.data.map(
        (item) => ({
          comingSoon: item.attributes.comingSoon || undefined,
          title: item.attributes.title,
          publishedAt: item.attributes.publishedAt,
          link: {
            text: item.attributes.link.text,
            url: item.attributes.link.href,
            target: item.attributes.link.target,
          },
          image:
            item.attributes.image.data && item.attributes.image.data.attributes,
        })
      ),
    },
  }),
  ...(strapiHomepage.data.attributes.ecosystem && {
    ecosystem: {
      title: strapiHomepage.data.attributes.ecosystem.title || '',
      productsTabName: strapiHomepage.data.attributes.ecosystem.productsTabName,
      products: strapiHomepage.data.attributes.ecosystem.products.data.map(
        (product) => ({
          title: product.attributes.name,
          text: product.attributes.description ?? '',
          href: `${product.attributes.slug}/overview`,
          icon: product.attributes.logo.data.attributes.url,
          useSrc: true,
        })
      ),
      solutionsTabName:
        strapiHomepage.data.attributes.ecosystem.solutionsTabName,
      solutions: strapiHomepage.data.attributes.ecosystem.solutions.data.map(
        (solution) => ({
          title: solution.attributes.title,
          text: solution.attributes.description ?? '',
          href: `/solutions/${solution.attributes.slug}`,
          icon: solution.attributes.icon.data.attributes.url,
          useSrc: true,
        })
      ),
      solutionsCta: strapiHomepage.data.attributes.ecosystem.solutionsCta && {
        variant: strapiHomepage.data.attributes.ecosystem.solutionsCta.variant,
        link: strapiHomepage.data.attributes.ecosystem.solutionsCta.link,
      },
    },
  }),
  seo: strapiHomepage?.data?.attributes?.seo,
  webinars: [
    ...strapiHomepage.data.attributes.webinars.data.map((webinar) =>
      makeWebinarFromStrapi(webinar)
    ),
  ],
});

export const makeHomepagePropsFromStatic = (
  staticHomepage: StaticHomepage
): HomepageProps => ({
  hero: staticHomepage.heroItems,
  newsShowcase: staticHomepage.newsShowcase,
  ecosystem: staticHomepage.ecosystem,
  comingsoonDocumentation: staticHomepage.comingsoonDocumentation,
  webinars: [],
});
