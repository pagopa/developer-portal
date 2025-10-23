'use client';
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type FragmentContextType = {
  fragment: string | null;
  // eslint-disable-next-line functional/no-return-void
  setFragment: (fragment: string | null) => void;
};

const FragmentContext = React.createContext<FragmentContextType | null>(null);

type FragmentProviderProps = {
  children: ReactNode;
};

export function FragmentProvider({ children }: FragmentProviderProps) {
  const [fragment, setFragmentState] = useState<string | null>(null);

  const setFragment = useCallback((nextFragment: string | null) => {
    setFragmentState((current) =>
      current === nextFragment ? current : nextFragment
    );
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

  const { fragment, setFragment } = context;

  return {
    fragment,
    setFragment,
  } as const;
}
