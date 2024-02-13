import { CtaSlideProps } from '@/components/atoms/CtaSlide/CtaSlide';
import { StrapiHomepage } from '@/lib/strapi/homepage';
import { translations } from '@/_contents/translations';

export type HomepageProps = {
  readonly hero: {
    readonly siteTitle: string;
    readonly boldTitle: string;
    readonly cards: readonly CtaSlideProps[];
  };
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

type StaticHeader = typeof translations.header;
type StaticHomepage = typeof translations.homepage;

export const makeHomepageProps = (
  strapiHomepage: StrapiHomepage,
  strapiEndpoint: string,
  staticHeader: StaticHeader,
  staticHomepage: StaticHomepage
): HomepageProps => ({
  ...makeHomepagePropsFromStatic(staticHeader, staticHomepage),
  comingsoonDocumentation:
    strapiHomepage.data.attributes.comingsoonDocumentation,
  productsShowcase: {
    title: strapiHomepage.data.attributes.productsShowcase.title,
    products: strapiHomepage.data.attributes.productsShowcase.products.data.map(
      (product) => ({
        name: product.attributes.name,
        description: product.attributes.description,
        slug: product.attributes.slug,
        logo: {
          ...product.attributes.logo.data.attributes,
          url: `${strapiEndpoint}${product.attributes.logo.data.attributes.url}`,
        },
      })
    ),
  },
});

export const makeHomepagePropsFromStatic = (
  staticHeader: StaticHeader,
  staticHomepage: StaticHomepage
): HomepageProps => ({
  hero: {
    siteTitle: staticHeader.title,
    boldTitle: staticHeader.boldTitle,
    cards: staticHomepage.heroItems,
  },
  news: {
    title: staticHomepage.news.title,
    cards: staticHomepage.news.list,
  },
  productsShowcase: staticHomepage.productsShowcase,
  comingsoonDocumentation: staticHomepage.comingsoonDocumentation,
});
