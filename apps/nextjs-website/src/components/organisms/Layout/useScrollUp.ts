/* eslint-disable functional/no-expression-statements */
import { useRef, useState, useEffect } from 'react';

const SCROLL_UP_TRESHOLD = 100;

export const useScrollUp = () => {
  const prevScrollY = useRef(0);
  const [scrollUp, setScrollUp] = useState(true);

  useEffect(() => {
    const updateVisibility = () => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - prevScrollY.current) >= SCROLL_UP_TRESHOLD) {
        const directionUp = scrollY < prevScrollY.current || scrollY === 0;
        setScrollUp(directionUp);

        // eslint-disable-next-line functional/immutable-data
        prevScrollY.current = scrollY > 0 ? scrollY : 0;
      }
    };

    const onScroll = () => {
      window.requestAnimationFrame(updateVisibility);
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return scrollUp;
};
