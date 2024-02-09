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
  readonly productsShowcaseTitle: string;
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
  staticHeader: StaticHeader,
  staticHomepage: StaticHomepage
): HomepageProps => ({
  ...makeHomepagePropsFromStatic(staticHeader, staticHomepage),
  comingsoonDocumentation:
    strapiHomepage.data.attributes.comingsoonDocumentation,
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
  productsShowcaseTitle: staticHomepage.productsShowcaseTitle,
  comingsoonDocumentation: staticHomepage.comingsoonDocumentation,
});
