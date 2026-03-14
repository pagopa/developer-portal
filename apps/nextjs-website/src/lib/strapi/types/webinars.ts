import { BlocksContent } from '@strapi/blocks-react-renderer';
import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiRelatedLinks } from '@/lib/strapi/types/link';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { StrapiWebinarCategory } from '@/lib/strapi/types/webinarCategory';
import { Paginated } from '@/lib/strapi/types/paginated';

type StrapiWebinarSpeaker = {
  readonly id: number;
  readonly name: string;
  readonly jobTitle: string;
  readonly publishedAt: string;
  readonly description?: BlocksContent;
  readonly avatar?: StrapiMedia;
};

type StrapiResource = {
  readonly title: string;
  readonly linkText: string;
  readonly linkHref: string;
  readonly subtitle?: string;
  readonly description?: BlocksContent;
  readonly image?: StrapiMedia;
};

type StrapiRelatedResources = {
  readonly title: string;
  readonly resources?: readonly StrapiResource[];
  readonly downloadableDocuments?: readonly StrapiMedia[];
};

type StrapiQuestionAndAnswer = {
  readonly question: string;
  readonly answer: BlocksContent;
};

export type StrapiWebinar = {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly slug: string;
  readonly publishedAt: string;
  readonly isVisibleInList: boolean;
  readonly coverImage: StrapiMedia;
  readonly bodyContent?: BlocksContent;
  readonly playerSrc?: string;
  readonly playerCoverImage?: StrapiMedia;
  readonly startDatetime?: string;
  readonly endDatetime?: string;
  readonly videoOnDemandStartAt?: number;
  readonly subscribeParagraphLabel?: string;
  readonly relatedLinks?: StrapiRelatedLinks;
  readonly relatedResources?: StrapiRelatedResources;
  readonly webinarSpeakers: readonly StrapiWebinarSpeaker[];
  readonly questionsAndAnswers?: readonly StrapiQuestionAndAnswer[];
  readonly seo?: StrapiSeo;
  readonly webinarCategory?: StrapiWebinarCategory;
  readonly headerImage?: StrapiMedia;
  readonly updatedAt: string;
};

export type StrapiWebinars = Paginated<StrapiWebinar>;
