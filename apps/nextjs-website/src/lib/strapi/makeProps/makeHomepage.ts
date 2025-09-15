import { StrapiHomepage } from "@/lib/strapi/types/homepage";
import { makeWebinarProps } from "@/lib/strapi/makeProps/makeWebinars";
import { HomepageProps } from "@/app/page";
import _ from "lodash";

export const makeHomepageProps = (
  strapiHomepage: StrapiHomepage,
): HomepageProps => ({
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
          comingSoon: item.attributes.comingSoon,
          title: item.attributes.title,
          publishedAt: new Date(item.attributes.publishedAt),
          label: item.attributes.label,
          link: {
            text: item.attributes.link.text,
            url: item.attributes.link.href,
            target: item.attributes.link.target,
          },
          image:
            item.attributes.image?.data &&
            item.attributes.image.data.attributes,
        }),
      ),
    },
  }),
  ...(strapiHomepage.data.attributes.ecosystem && {
    ecosystem: {
      title: strapiHomepage.data.attributes.ecosystem.title || "",
      productsTabName: strapiHomepage.data.attributes.ecosystem.productsTabName,
      products: strapiHomepage.data.attributes.ecosystem.products.data.map(
        (product) => ({
          title: product.attributes.name,
          text: product.attributes.description ?? "",
          href: `${product.attributes.slug}/overview`,
          icon: product.attributes.logo.data?.attributes.url || "",
          useSrc: true,
        }),
      ),
      solutionsTabName:
        strapiHomepage.data.attributes.ecosystem.solutionsTabName,
      solutions: strapiHomepage.data.attributes.ecosystem.solutions.data.map(
        (solution) => ({
          title: solution.attributes.title,
          text: solution.attributes.description ?? "",
          href: `/solutions/${solution.attributes.slug}`,
          icon: solution.attributes.icon.data.attributes.url,
          useSrc: true,
        }),
      ),
      solutionsCta: strapiHomepage.data.attributes.ecosystem.solutionsCta && {
        variant: strapiHomepage.data.attributes.ecosystem.solutionsCta.variant,
        link: strapiHomepage.data.attributes.ecosystem.solutionsCta.link,
      },
    },
  }),
  seo: strapiHomepage?.data?.attributes?.seo,
  webinars: _.compact(
    strapiHomepage.data.attributes.webinars.data.map((webinar) =>
      makeWebinarProps(webinar),
    ),
  ),
});
