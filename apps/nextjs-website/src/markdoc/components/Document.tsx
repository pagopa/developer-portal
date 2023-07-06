import Stack from '@mui/material/Stack';
import { ReactNode } from 'react';

type DocumentProps = {
  children: ReactNode;
};

const Document = ({ children }: DocumentProps) => (
  <Stack spacing={2}>{children}</Stack>
);

export default Document;
