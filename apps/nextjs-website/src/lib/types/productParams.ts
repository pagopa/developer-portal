export type ProductParams = {
  readonly params: Promise<{
    readonly locale: string;
    readonly productSlug: string;
  }>;
};
