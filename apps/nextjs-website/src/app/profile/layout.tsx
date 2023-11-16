'use client';

import ProfileMenu from '@/components/atoms/ProfileMenu/ProfileMenu';
import { Box } from '@mui/material';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex' }}>
      <ProfileMenu name='Mario Rossi'></ProfileMenu>
      {children}
    </Box>
  );
}
