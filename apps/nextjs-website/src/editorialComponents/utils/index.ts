import React from 'react';
import { type Generic } from '../types/components';

/**
 * this function utility can be used to verify
 * if component's props is a JSX to render
 */
export const isJSX = <T>(arg: T | Generic): arg is Generic =>
  React.isValidElement(arg);

/**
 * a custom hook: it receives a ref as argument
 * and return a boolen with a true value when the ref pointing
 * to a tag element is visible
 */
export function useIsVisible(ref: React.RefObject<Element>) {
  const [isIntersecting, setIntersecting] = React.useState(false);

  // eslint-disable-next-line functional/no-expression-statements
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // eslint-disable-next-line functional/no-expression-statements
      setIntersecting(entry.isIntersecting);
    });

    // eslint-disable-next-line functional/no-expression-statements
    if (ref.current) observer.observe(ref.current);
    return () => {
      // eslint-disable-next-line functional/no-expression-statements
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}

export const hrefNoOp = 'javascript:void(0)';
