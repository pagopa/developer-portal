import type { createElement, Fragment } from 'react';

export type ReactShape = {
  readonly createElement: typeof createElement;
  readonly Fragment: typeof Fragment;
};
