export type Theme = 'dark' | 'light';

/** this Generic type is meant to be used
 * fot those components that will accept any JSX to
 * be rendered
 */
export type Generic = React.JSX.Element;

export interface CommonProps {
  theme: Theme;
}
