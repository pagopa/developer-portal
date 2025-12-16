import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      readonly 'rapi-doc': React.HTMLAttributes<HTMLElement> &
        Record<string, unknown>;
    }
  }
}
