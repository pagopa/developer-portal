import { CtaSlideProps } from '@/components/atoms/CtaSlide/CtaSlide';

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
