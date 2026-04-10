import { BlocksContent } from '@strapi/blocks-react-renderer';

export type CustomMessage = {
  readonly key: string;
  readonly value: BlocksContent;
};

export type CustomMessagesMap = {
  readonly data: {
    readonly customMessages: readonly CustomMessage[];
  };
};
