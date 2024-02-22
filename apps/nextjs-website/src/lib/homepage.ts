import { CtaSlideProps } from '@/components/atoms/CtaSlide/CtaSlide';
import { StrapiHomepage } from '@/lib/strapi/homepage';
import { translations } from '@/_contents/translations';

export type HomepageProps = {
  readonly hero: readonly CtaSlideProps[];
  readonly news: {
    readonly title: string;
    readonly cards: readonly {
      readonly comingSoon?: boolean;
      readonly title: string;
      readonly dateString?: string;
      readonly image?: {
        readonly url: string;
        readonly alt: string;
      };
      readonly href: {
        readonly label: string;
        readonly link: string;
        readonly title: string;
      };
    }[];
  };
  readonly productsShowcase: {
    readonly title: string;
    readonly products: readonly {
      readonly name: string;
      readonly description: string;
      readonly slug: string;
      readonly logo: {
        readonly name: string;
        readonly width: number;
        readonly height: number;
        readonly ext: string;
        readonly mime: string;
        readonly url: string;
      };
    }[];
  };
  readonly comingsoonDocumentation: {
    readonly title: string;
    readonly links: readonly {
      readonly text: string;
      readonly href: string;
    }[];
  };
};

type StaticHomepage = typeof translations.homepage;

export const makeHomepageProps = (
  strapiHomepage: StrapiHomepage,
  staticHomepage: StaticHomepage
): HomepageProps => ({
  ...makeHomepagePropsFromStatic(staticHomepage),
  comingsoonDocumentation:
    strapiHomepage.data.attributes.comingsoonDocumentation,
  hero: strapiHomepage.data.attributes.heroSlider.map((slide) => ({
    title: slide.title,
    titleColor: slide.titleColor,
    backgroundImage: slide.backgroundImage?.data.attributes,
    callToAction: slide.callToAction && {
      link: {
        href: slide.callToAction.link.href,
        text: slide.callToAction.link.text,
        target: slide.callToAction.link.target,
      },
    },
  })),
  productsShowcase: {
    title: strapiHomepage.data.attributes.productsShowcase.title,
    products: strapiHomepage.data.attributes.productsShowcase.products.data.map(
      (product) => ({
        name: product.attributes.name,
        description: product.attributes.description,
        slug: product.attributes.slug,
        logo: product.attributes.logo.data.attributes,
      })
    ),
  },
});

export const makeHomepagePropsFromStatic = (
  staticHomepage: StaticHomepage
): HomepageProps => ({
  hero: staticHomepage.heroItems,
  news: {
    title: staticHomepage.news.title,
    cards: staticHomepage.news.list,
  },
  productsShowcase: staticHomepage.productsShowcase,
  comingsoonDocumentation: staticHomepage.comingsoonDocumentation,
});
