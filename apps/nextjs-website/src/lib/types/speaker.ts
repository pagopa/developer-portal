import { BlocksContent } from '@strapi/blocks-react-renderer';
import { Media } from './media';

export type Speaker = {
  readonly name: string;
  readonly jobTitle: string;
  readonly description?: BlocksContent;
  readonly avatar?: Media;
};
