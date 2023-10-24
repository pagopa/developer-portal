'use client';
import React, { ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import { usePathname } from 'next/navigation';
import { Box, useTheme } from '@mui/material';
import { translations } from '@/_contents/translations';

type ProfileMenuProps = {
  name: string;
};

const ProfileMenu = ({ name }: ProfileMenuProps) => {
  const { palette } = useTheme();
  const { shared } = translations;

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
      >
        <Typography
          variant='h6'
          sx={{
            padding: '0px 32px',
            verticalAlign: 'middle',
            fontWeight: 'regular',
          }}
        >
          Ciao,
        </Typography>
        <Typography
          variant='h5'
          sx={{
            padding: '0px 32px',
            verticalAlign: 'middle',
          }}
        >
          {name}
        </Typography>

        <Box
          sx={{
            borderRight: '3px solid ' + palette.primary.main,
            backgroundColor: palette.primary.main + '14',
            backgroundOpacity: 0.08,
            padding: '10px 32px',
            marginTop: '32px',
            cursor: 'pointer',
          }}
        >
          I tuoi dati
        </Box>
        <Box
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.OneTrust.ToggleInfoDisplay();
          }}
          sx={{
            marginTop: '12px',
            padding: '10px 32px',
            cursor: 'pointer',
          }}
        >
          Consensi e privacy
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileMenu;
