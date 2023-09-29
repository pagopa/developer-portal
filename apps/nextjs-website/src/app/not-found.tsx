'use client';

import { CircularProgress, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Questo serve per evitare di cambiare output export, perchè di default next usa i middleware per gestire il caso in cui si atterri su
// /rotta senza il parametro di lingua, ma questo non funziona in caso di export perchè sono tutte pagine statiche quindi creiamo la vista di
// not found come componente dinamico che viene caricato e via js fa il redirect alla pagina giusta /it/pagina
export default function PageNotFound() {
  const router = useRouter();
  useEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    router.push('/it' + window.location.pathname);
  }, []);

  // Todo: Transform into a component
  return (
    <Stack
      justifyContent={'center'}
      height={500}
      padding={2}
      alignItems='center'
    >
      <CircularProgress />
    </Stack>
  );
}
