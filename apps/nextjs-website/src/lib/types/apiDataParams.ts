export type ApiDataParams = {
  readonly params: Promise<{
    readonly locale: string;
    readonly productSlug: string;
    readonly apiDataSlug: string;
  }>;
};
