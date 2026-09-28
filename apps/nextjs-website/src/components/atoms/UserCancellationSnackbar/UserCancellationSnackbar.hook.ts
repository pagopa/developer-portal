'use client';

import { useEffect, useState } from 'react';

const useSessionStorageBoolean = (key: string) => {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const storedValue = sessionStorage.getItem(key);

    if (storedValue === 'true') {
      setValue(true);
      sessionStorage.removeItem(key);
    }
  }, [key]);

  return [value, setValue] as const;
};

export default useSessionStorageBoolean;
