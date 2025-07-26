export type Link = {
  readonly text: string;
  readonly href: string;
  readonly target?: '_self' | '_blank' | '_parent' | '_top' | null;
};

export type RelatedLinks = {
  readonly title?: string | null;
  readonly links: ReadonlyArray<Link>;
};
