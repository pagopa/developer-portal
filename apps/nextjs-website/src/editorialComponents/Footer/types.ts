import * as t from 'io-ts';
import { IconWrapperProps } from '@/components/atoms/IconWrapper/IconWrapper';

export type LinkType = 'internal' | 'external';
export type FooterColumnIcon = IconWrapperProps & { readonly href: string };

export interface FooterLinksType {
  readonly label: string;
  /** the url to witch the user will be redirected */
  readonly href?: string;
  readonly ariaLabel: string;
  readonly linkType: LinkType;
  /** if defined it will override the href behavior */

  readonly onClick?: () => void;
}

export interface PreLoginFooterSingleSectionType {
  readonly title?: string;
  readonly links: readonly FooterLinksType[];
}

export interface PreLoginFooterLinksType {
  readonly services: PreLoginFooterSingleSectionType;
  readonly aboutUs: PreLoginFooterSingleSectionType;
  readonly resources: PreLoginFooterSingleSectionType;
  readonly followUs: {
    readonly title: string;
    readonly socialLinks: readonly FooterColumnIcon[];
    readonly links: readonly FooterLinksType[];
  };
}

export interface CompanyLinkType {
  /** the url to witch the user will be redirected */
  readonly href?: string;
  readonly ariaLabel: string;
  /** if defined it will override the href behavior */

  readonly onClick?: () => void;
}

export class EnumType<A> extends t.Type<A> {
  public readonly _tag = 'EnumType' as const;
  public readonly enumObject!: object;
  public constructor(e: object, name?: string) {
    // eslint-disable-next-line functional/no-expression-statements
    super(
      name ?? 'enum',
      (u): u is A =>
        Object.values(this.enumObject).includes(u) &&
        typeof (this.enumObject as never)[u as string] !== 'number',

      (u, c) => (this.is(u) ? t.success(u) : t.failure(u, c)),
      t.identity,
    );
    // eslint-disable-next-line functional/no-expression-statements
    this.enumObject = e;
  }
}
export function createEnumType<T>(e: object, name?: string) {
  return new EnumType<T>(e, name);
}
