import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import { ProductCodec } from '@/lib/strapi/codecs/ProductCodec';
import { BlocksContentCodec } from '@/lib/strapi/codecs/BlocksContentCodec';
import { FeaturesCodec } from '@/lib/strapi/codecs/FeaturesCodec';
import { BaseGuideCodec } from '@/lib/strapi/codecs/GuidesCodec';
import { LinkCodec } from '@/lib/strapi/codecs/LinkCodec';
import { MediaCodec } from '@/lib/strapi/codecs/MediaCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { PaginationCodec } from '@/lib/strapi/codecs/PaginationCodec';
import { RelatedLinksCodec } from '@/lib/strapi/codecs/RelatedLinksCodec';
import { BaseTutorialCodec } from './TutorialCodec';
import { BannerLinkCodec } from '@/lib/strapi/codecs/BannerLinkCodec';

const StartInfoCodec = t.strict({
  icon: t.strict({ data: MediaCodec }),
  title: t.string,
  description: t.string,
  path: t.string,
});

const StartInfoSectionCodec = t.strict({
  title: t.string,
  bottomLabel: t.union([NullToUndefinedCodec, t.string]),
  bottomLink: t.union([NullToUndefinedCodec, LinkCodec]),
  items: t.array(StartInfoCodec),
});

const TutorialSectionCodec = t.strict({
  title: t.string,
  description: t.string,
  tutorials: t.strict({ data: t.array(BaseTutorialCodec) }),
});

const CardPropsCodec = t.strict({
  title: t.string,
  content: BlocksContentCodec,
  linkText: t.string,
  linkHref: t.string,
  image: t.strict({ data: MediaCodec }),
  mobileImage: t.strict({ data: MediaCodec }),
});

const ServiceModelCodec = t.strict({
  title: t.string,
  description: t.string,
  href: t.string,
});

const PostIntegrationCodec = t.strict({
  title: t.string,
  description: t.string,
  link: t.union([NullToUndefinedCodec, LinkCodec]),
  guidesTitle: t.union([NullToUndefinedCodec, t.string]),
  documents: t.array(CardPropsCodec),
  guides: t.strict({ data: t.array(BaseGuideCodec) }),
  serviceModels: t.array(ServiceModelCodec),
});

const BaseOverviewAttributesCodec = t.strict({
  title: t.string,
  createdAt: tt.DateFromISOString,
  updatedAt: tt.DateFromISOString,
  publishedAt: tt.DateFromISOString,
  subtitle: t.string,
});

export const BaseOverviewCodec = t.strict({
  attributes: BaseOverviewAttributesCodec,
});

export const OverviewCodec = t.strict({
  id: t.number,
  attributes: t.intersection([
    BaseOverviewAttributesCodec,
    t.strict({
      backgroundImage: t.strict({ data: MediaCodec }),
      features: t.union([NullToUndefinedCodec, FeaturesCodec]),
      startInfoSection: t.union([NullToUndefinedCodec, StartInfoSectionCodec]),
      tutorialSection: t.union([NullToUndefinedCodec, TutorialSectionCodec]),
      postIntegration: t.union([NullToUndefinedCodec, PostIntegrationCodec]),
      relatedLinks: t.union([NullToUndefinedCodec, RelatedLinksCodec]),
      product: t.strict({
        data: t.union([NullToUndefinedCodec, ProductCodec]),
      }),
      bannerLinks: t.array(BannerLinkCodec),
    }),
  ]),
});

export const OverviewsCodec = t.strict({
  data: t.array(OverviewCodec),
  meta: PaginationCodec,
});

export type StrapiOverviews = t.TypeOf<typeof OverviewsCodec>;
