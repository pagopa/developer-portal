export type Path = {
  readonly name: string;
  readonly path: string;
};

export type BreadCrumbSegment = Path & {
  readonly translate?: boolean;
};
