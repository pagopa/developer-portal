import { BlocksContent } from '@strapi/blocks-react-renderer';
import { Media } from '@/lib/strapi/codecs/MediaCodec';

export type Speaker = {
  readonly name: string;
  readonly jobTitle: string;
  readonly description?: BlocksContent;
  readonly avatar?: Media;
};
