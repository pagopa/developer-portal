export type StrapiLink = {
  readonly text: string;
  readonly href: string;
  readonly target?: '_self' | '_blank' | '_parent' | '_top';
};

export type StrapiRelatedLinks = {
  readonly title?: string;
  readonly links: ReadonlyArray<StrapiLink>;
};
