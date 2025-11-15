import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { Product } from './product';
import { SEO } from './seo';

export type GitBookContentData = {
  readonly bodyConfig: ParseContentConfig;
  readonly guide?: {
    readonly name: string;
    readonly path: string;
  };
  readonly page?: {
    readonly path: string;
    readonly isIndex: boolean;
    readonly title: string;
    readonly menu: string;
    readonly body: string;
  };
  readonly product?: Product;
  readonly seo?: SEO;
  readonly solution?: {
    readonly path?: string;
    readonly slug?: string;
    readonly title?: string;
  };
  readonly title?: string;
  readonly version?: {
    readonly name: string;
    readonly path: string;
  };
  readonly versions?: readonly {
    readonly name: string;
    readonly path: string;
  }[];
};
