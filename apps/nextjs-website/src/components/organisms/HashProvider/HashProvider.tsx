import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type HashContextType = {
  hash: string | null;
  setHash: React.Dispatch<React.SetStateAction<string | null>>;
};

export const HashContext = React.createContext<HashContextType | null>(null);

type HashProviderProps = {
  children: ReactNode;
};

export function HashProvider({ children }: HashProviderProps) {
  const [hash, setHash] = useState<string | null>(() =>
    typeof window !== 'undefined' ? window.location.hash : null
  );

  const hashChangeHandler = useCallback(() => {
    setHash(window.location.hash);
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', hashChangeHandler);
    return () => {
      window.removeEventListener('hashchange', hashChangeHandler);
    };
  }, []);

  return (
    <HashContext.Provider
      value={{
        hash,
        setHash,
      }}
    >
      {children}
    </HashContext.Provider>
  );
}

export function useHash() {
  const context = useContext(HashContext);
  if (!context)
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(
      'HashContext not found, did you forget to wrap your app with HashProvider?'
    );

  const { hash } = context;

  return {
    hash,
  } as const;
}
