import { BlocksContent } from '@strapi/blocks-react-renderer';
import { MediaAttributes } from '@/lib/strapi/types/media';

export type Speaker = {
  readonly name: string;
  readonly jobTitle: string;
  readonly description?: BlocksContent;
  readonly avatar?: MediaAttributes;
};
