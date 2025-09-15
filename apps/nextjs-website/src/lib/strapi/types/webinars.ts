import { BlocksContent } from "@strapi/blocks-react-renderer";
import { StrapiMedia } from "@/lib/strapi/types/media";
import { StrapiRelatedLinks } from "@/lib/strapi/types/link";
import { StrapiSeo } from "@/lib/strapi/types/seo";
import { StrapiWebinarCategory } from "@/lib/strapi/types/webinarCategory";
import { Paginated } from "@/lib/strapi/types/paginated";

type StrapiWebinarSpeaker = {
  readonly id: number;
  readonly attributes: {
    readonly name: string;
    readonly jobTitle: string;
    readonly publishedAt: string;
    readonly description?: BlocksContent;
    readonly avatar: { readonly data?: StrapiMedia };
  };
};

type StrapiResource = {
  readonly title: string;
  readonly linkText: string;
  readonly linkHref: string;
  readonly subtitle?: string;
  readonly description?: BlocksContent;
  readonly image: { readonly data?: StrapiMedia };
};

type StrapiRelatedResources = {
  readonly title: string;
  readonly resources?: readonly StrapiResource[];
  readonly downloadableDocuments?: { readonly data: readonly StrapiMedia[] };
};

type StrapiQuestionAndAnswer = {
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
    readonly coverImage: { readonly data: StrapiMedia };
    readonly bodyContent?: BlocksContent;
    readonly playerSrc?: string;
    readonly startDatetime?: string;
    readonly endDatetime?: string;
    readonly subscribeParagraphLabel?: string;
    readonly relatedLinks?: StrapiRelatedLinks;
    readonly relatedResources?: StrapiRelatedResources;
    readonly webinarSpeakers: {
      readonly data: readonly StrapiWebinarSpeaker[];
    };
    readonly questionsAndAnswers?: readonly StrapiQuestionAndAnswer[];
    readonly seo?: StrapiSeo;
    readonly webinarCategory: { readonly data?: StrapiWebinarCategory };
    readonly headerImage: { readonly data?: StrapiMedia };
    readonly updatedAt: string;
  };
};

export type StrapiWebinars = Paginated<StrapiWebinar>;
