import { CtaSlideProps } from '@/components/atoms/CtaSlide/CtaSlide';
import { StrapiHomepage } from '@/lib/strapi/homepage';
import { translations } from '@/_contents/translations';
import { Webinar } from './types/webinar';
import { webinars } from '@/_contents/webinars';
import { CardsGridProps } from '@/components/molecules/CardsGrid/CardsGrid';

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
  readonly ecosystem: {
    readonly title: string;
    readonly productsTabName: string;
    readonly products: CardsGridProps['cards'];
    readonly solutionsTabName: string;
    readonly solutions: CardsGridProps['cards'];
    readonly solutionsCta?: {
      readonly variant?: 'text' | 'contained' | 'outlined';
      readonly link: {
        readonly href: string;
        readonly text: string;
        readonly target?: '_self' | '_blank' | '_parent' | '_top';
      };
    };
  };
  readonly comingsoonDocumentation: {
    readonly title: string;
    readonly links: readonly {
      readonly text: string;
      readonly href: string;
    }[];
  };
  readonly webinars: readonly Webinar[];
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
  ecosystem: {
    title: strapiHomepage.data.attributes.ecosystem.title,
    productsTabName: strapiHomepage.data.attributes.ecosystem.productsTabName,
    products: strapiHomepage.data.attributes.ecosystem.products.data.map(
      (product) => ({
        title: product.attributes.name,
        text: product.attributes.description ?? '',
        href: product.attributes.slug,
        icon: product.attributes.logo.data.attributes.url,
      })
    ),
    solutionsTabName: strapiHomepage.data.attributes.ecosystem.solutionsTabName,
    solutions: strapiHomepage.data.attributes.ecosystem.solutions.data.map(
      (solution) => ({
        title: solution.attributes.title,
        text: solution.attributes.description ?? '',
        href: solution.attributes.slug,
        icon: solution.attributes.icon.data.attributes.url,
      })
    ),
    solutionsCta: strapiHomepage.data.attributes.ecosystem.solutionsCta && {
      variant: strapiHomepage.data.attributes.ecosystem.solutionsCta.variant,
      link: strapiHomepage.data.attributes.ecosystem.solutionsCta.link,
    },
  },
  webinars: [
    ...webinars.filter((webinar) => webinar.isVisibleInHome),
    ...strapiHomepage.data.attributes.webinars.data.map((webinar) => ({
      ...webinar.attributes,
      startDateTime: webinar.attributes.startDatetime?.toISOString(),
      endDateTime: webinar.attributes.endDatetime?.toISOString(),
      imagePath: webinar.attributes.coverImage.data.attributes.url,
      speakers: webinar.attributes.webinarSpeakers.data.map((speaker) => ({
        ...speaker.attributes,
        avatar: speaker.attributes.avatar.data?.attributes,
      })),
    })),
  ],
});

export const makeHomepagePropsFromStatic = (
  staticHomepage: StaticHomepage
): HomepageProps => ({
  hero: staticHomepage.heroItems,
  newsShowcase: staticHomepage.newsShowcase,
  ecosystem: staticHomepage.ecosystem,
  comingsoonDocumentation: staticHomepage.comingsoonDocumentation,
  webinars: webinars.filter((webinar) => webinar.isVisibleInHome),
});
