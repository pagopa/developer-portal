export type HomepageApi = {
  readonly comingsoonDocumentation: {
    readonly title: string;
    readonly links: readonly {
      readonly text: string;
      readonly href: string;
      readonly target?: '_self' | '_blank' | '_parent' | '_top';
    }[];
  };
};
