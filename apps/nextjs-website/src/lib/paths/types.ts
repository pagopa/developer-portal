export type Path = {
  readonly name: string;
  readonly path: string;
};

export type BreadcrumbSegment = Path & {
  readonly translate?: boolean;
};
