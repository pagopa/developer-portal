/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
'use client';
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type FragmentContextType = {
  fragment: string | null;
  setFragment: (
    fragment: string | null,
    options?: { source?: 'manual'; suppressAutoForMs?: number }
  ) => void;
  setFragmentFromScroll: (fragment: string | null) => boolean;
};

const FragmentContext = React.createContext<FragmentContextType | null>(null);

type FragmentProviderProps = {
  children: ReactNode;
};

export function FragmentProvider({ children }: FragmentProviderProps) {
  const [fragment, setFragmentState] = useState<string | null>(null);
  const autoUpdateBlockedUntilRef = useRef(0);

  const setFragment = useCallback(
    (
      nextFragment: string | null,
      options?: { source?: 'manual'; suppressAutoForMs?: number }
    ) => {
      setFragmentState((current) =>
        current === nextFragment ? current : nextFragment
      );

      if (options?.source === 'manual') {
        const suppressMs = options.suppressAutoForMs ?? 0;
        autoUpdateBlockedUntilRef.current = Date.now() + suppressMs;
      }
    },
    []
  );

  const setFragmentFromScroll = useCallback((nextFragment: string | null) => {
    if (Date.now() < autoUpdateBlockedUntilRef.current) return false;

    let didUpdate = false;
    setFragmentState((current) => {
      if (current === nextFragment) return current;
      didUpdate = true;
      return nextFragment;
    });

    if (didUpdate) {
      // eslint-disable-next-line functional/immutable-data
      autoUpdateBlockedUntilRef.current = 0;
    }

    return didUpdate;
  }, []);

  const fragmentChangeHandler = useCallback(() => {
    setFragment(typeof window !== 'undefined' ? window.location.hash : null);
  }, [setFragment]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setFragment(window.location.hash);
    window.addEventListener('hashchange', fragmentChangeHandler);
    return () => {
      window.removeEventListener('hashchange', fragmentChangeHandler);
    };
  }, [fragmentChangeHandler, setFragment]);

  return (
    <FragmentContext.Provider
      value={{
        fragment,
        setFragment,
        setFragmentFromScroll,
      }}
    >
      {children}
    </FragmentContext.Provider>
  );
}

export function useFragment() {
  const context = useContext(FragmentContext);
  if (!context)
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(
      'FragmentContext not found, did you forget to wrap your app with FragmentProvider?'
    );

  const { fragment, setFragment, setFragmentFromScroll } = context;

  return {
    fragment,
    setFragment,
    setFragmentFromScroll,
  } as const;
}
