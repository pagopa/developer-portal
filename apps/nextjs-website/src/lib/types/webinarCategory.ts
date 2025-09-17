import { Media } from './media';

export type WebinarCategory = {
  readonly name: string;
  readonly icon: { readonly data: { readonly attributes: Media } };
};
