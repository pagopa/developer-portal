import { BlocksContent } from '@strapi/blocks-react-renderer';
import { Media } from '@/lib/strapi/types/media';
import { Pagination } from '@/lib/strapi/types/pagination';
import { RelatedLinks } from '@/lib/strapi/types/link';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { StrapiWebinarCategory } from '@/lib/strapi/types/webinarCategory';

type WebinarSpeaker = {
  readonly id: number;
  readonly attributes: {
    readonly name: string;
    readonly jobTitle: string;
    readonly publishedAt: string;
    readonly description?: BlocksContent;
    readonly avatar: { readonly data?: Media };
  };
};

type Resource = {
  readonly title: string;
  readonly linkText: string;
  readonly linkHref: string;
  readonly subtitle?: string;
  readonly description?: BlocksContent;
  readonly image: { readonly data?: Media };
};

type RelatedResources = {
  readonly title: string;
  readonly resources?: readonly Resource[];
  readonly downloadableDocuments?: { readonly data: readonly Media[] };
};

type QuestionAndAnswer = {
  readonly question: string;
  readonly answer: BlocksContent;
};

export type StrapiWebinar = {
  readonly id: number;
  readonly attributes: {
    readonly title: string;
    readonly description: string;
    readonly slug: string;
    readonly publishedAt: string;
    readonly isVisibleInList: boolean;
    readonly coverImage: { readonly data: Media };
    readonly bodyContent?: BlocksContent;
    readonly playerSrc?: string;
    readonly startDatetime?: string;
    readonly endDatetime?: string;
    readonly subscribeParagraphLabel?: string;
    readonly relatedLinks?: RelatedLinks;
    readonly relatedResources?: RelatedResources;
    readonly webinarSpeakers: { readonly data: readonly WebinarSpeaker[] };
    readonly questionsAndAnswers?: readonly QuestionAndAnswer[];
    readonly seo?: StrapiSeo;
    readonly webinarCategory?: { readonly data?: StrapiWebinarCategory };
    readonly headerImage?: { readonly data?: Media };
    readonly updatedAt: string;
  };
};

export type StrapiWebinars = {
  readonly data: readonly StrapiWebinar[];
  readonly meta: {
    readonly pagination: Pagination;
  };
};
