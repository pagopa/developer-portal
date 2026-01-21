export type ApiDataParams = {
  readonly params: Promise<{
    readonly productSlug: string;
    readonly apiDataSlug: string;
  }>;
};
