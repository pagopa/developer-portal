'use client';
import React from 'react';
import { Box, useTheme } from '@mui/material';

type ProfileMenuProps = {
  name: string;
};

const ProfileMenu = ({ name }: ProfileMenuProps) => {
  const { palette } = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: palette.grey[50],
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '80px 0',
          width: { lg: '347px' },
          flexGrow: { lg: 0 },
          flexShrink: { lg: 0 },
          position: 'sticky',
          overflowY: 'auto',
          top: 50,
          scrollbarWidth: 'thin',
        }}
      ></Box>
    </Box>
  );
};

export default ProfileMenu;
