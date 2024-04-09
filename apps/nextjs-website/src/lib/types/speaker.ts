import { BlocksContent } from '@strapi/blocks-react-renderer';

export type Speaker = {
  readonly name: string;
  readonly jobTitle: string;
  readonly description?: BlocksContent;
  readonly avatar?: {
    readonly name: string;
    readonly alternativeText: string | null;
    readonly width: number;
    readonly height: number;
    readonly ext: string;
    readonly mime: string;
    readonly url: string;
  };
};
