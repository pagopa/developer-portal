import { ReactElement } from 'react';

export type Theme = 'dark' | 'light';

/** this Generic type is meant to be used
 * fot those components that will accept any JSX to
 * be rendered
 */
export type Generic = ReactElement;

export interface CommonProps {
  // eslint-disable-next-line functional/prefer-readonly-type
  theme: Theme;
}
