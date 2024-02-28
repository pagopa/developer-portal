import { CtaSlideProps } from '@/components/atoms/CtaSlide/CtaSlide';
import { StrapiHomepage } from '@/lib/strapi/homepage';
import { translations } from '@/_contents/translations';

export type HomepageProps = {
  readonly hero: readonly CtaSlideProps[];
  readonly newsShowcase: {
    readonly title: string;
    readonly items: readonly {
      readonly comingSoon?: boolean;
      readonly title: string;
      readonly publishedAt?: Date;
      readonly link: {
        readonly text: string;
        readonly url: string;
        readonly target?: '_self' | '_blank' | '_parent' | '_top' | null;
      };
      readonly image: {
        readonly name: string;
        readonly alternativeText: string | null;
        readonly width: number;
        readonly height: number;
        readonly ext: string;
        readonly mime: string;
        readonly url: string;
      } | null;
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
    backgroundImage: slide.backgroundImage?.data?.attributes,
    callToAction: slide.callToAction && {
      link: {
        href: slide.callToAction.link.href,
        text: slide.callToAction.link.text,
        target: slide.callToAction.link.target,
      },
    },
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
  newsShowcase: staticHomepage.newsShowcase,
  productsShowcase: staticHomepage.productsShowcase,
  comingsoonDocumentation: staticHomepage.comingsoonDocumentation,
});
