import { Media } from './media';

export type Tag = {
  readonly name: string;
  readonly icon: { readonly data: { readonly attributes: Media } };
};
