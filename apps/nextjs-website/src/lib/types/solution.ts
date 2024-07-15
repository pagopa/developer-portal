export type Solution = {
  readonly slug: string;
  readonly kickerTitle: string;
  readonly title: string;
  readonly description?: string;
  readonly dirName: string;
  readonly landingUseCaseFile: string;
  readonly publishedAt: Date;
  readonly icon: string;
  readonly introductionToSteps?: string;
};
