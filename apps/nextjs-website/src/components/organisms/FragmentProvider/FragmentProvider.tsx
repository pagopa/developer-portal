import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type FragmentContextType = {
  fragment: string | null;
};

const FragmentContext = React.createContext<FragmentContextType | null>(null);

type FragmentProviderProps = {
  children: ReactNode;
};

export function FragmentProvider({ children }: FragmentProviderProps) {
  const [fragment, setFragment] = useState<string | null>(() =>
    typeof window !== 'undefined' ? window.location.hash : null
  );

  const fragmentChangeHandler = useCallback(() => {
    setFragment(window.location.hash);
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', fragmentChangeHandler);
    return () => {
      window.removeEventListener('hashchange', fragmentChangeHandler);
    };
  }, []);

  return (
    <FragmentContext.Provider
      value={{
        fragment,
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

  const { fragment } = context;

  return {
    fragment,
  } as const;
}
