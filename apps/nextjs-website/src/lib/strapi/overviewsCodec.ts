import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import * as qs from 'qs';
import { BaseProductCodec } from '@/lib/strapi/codecs/ProductCodec';
import { BaseTutorialCodec } from '@/lib/strapi/tutorial';
import { BlocksContentCodec } from '@/lib/strapi/codecs/BlocksContentCodec';
import { FeaturesCodec } from '@/lib/strapi/codecs/FeaturesCodec';
import { BaseGuideCodec } from '@/lib/strapi/codecs/GuideCodec';
import { LinkCodec } from '@/lib/strapi/codecs/LinkCodec';
import { MediaCodec } from '@/lib/strapi/codecs/MediaCodec';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';
import { PaginationCodec } from '@/lib/strapi/codecs/PaginationCodec';
import { RelatedLinksCodec } from '@/lib/strapi/codecs/RelatedLinksCodec';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';

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

const PostIntegrationCodec = t.strict({
  title: t.string,
  description: t.string,
  link: t.union([NullToUndefinedCodec, LinkCodec]),
  documents: t.array(CardPropsCodec),
  guidesTitle: t.union([NullToUndefinedCodec, t.string]),
  guides: t.strict({ data: t.array(BaseGuideCodec) }),
  showCompactCards: t.boolean,
});

export const OverviewCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    createdAt: tt.DateFromISOString,
    updatedAt: tt.DateFromISOString,
    publishedAt: tt.DateFromISOString,
    subtitle: t.string,
    backgroundImage: t.strict({ data: MediaCodec }),
    features: t.union([NullToUndefinedCodec, FeaturesCodec]),
    startInfoSection: t.union([NullToUndefinedCodec, StartInfoSectionCodec]),
    tutorialSection: t.union([NullToUndefinedCodec, TutorialSectionCodec]),
    postIntegration: t.union([NullToUndefinedCodec, PostIntegrationCodec]),
    relatedLinks: t.union([NullToUndefinedCodec, RelatedLinksCodec]),
    product: t.strict({
      data: t.union([NullToUndefinedCodec, BaseProductCodec]),
    }),
  }),
});

export const StrapiOverviewsCodec = t.strict({
  data: t.array(OverviewCodec),
  meta: PaginationCodec,
});

export type StrapiOverviews = t.TypeOf<typeof StrapiOverviewsCodec>;

const makeStrapiOverviewsPopulate = () =>
  qs.stringify({
    populate: {
      backgroundImage: '*',
      product: '*',
      relatedLinks: {
        populate: ['links'],
      },
      features: {
        populate: ['items.icon'],
      },
      startInfoSection: {
        populate: ['bottomLink', 'items.icon'],
      },
      tutorialSection: {
        populate: ['tutorials.image'],
      },
      postIntegration: {
        populate: [
          'link',
          'guides.image',
          'guides.mobileImage',
          'documents.image',
          'documents.mobileImage',
        ],
      },
    },
  });

export const fetchOverviews = fetchFromStrapi(
  'overviews',
  makeStrapiOverviewsPopulate(),
  StrapiOverviewsCodec
);
