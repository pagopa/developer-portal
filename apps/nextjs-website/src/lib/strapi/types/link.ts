export type Link = {
  readonly text: string;
  readonly href: string;
  readonly target?: '_self' | '_blank' | '_parent' | '_top';
};

export type RelatedLinks = {
  readonly title?: string;
  readonly links: ReadonlyArray<Link>;
};
