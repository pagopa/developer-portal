'use client';
import React from 'react';
import { Box, Link as MuiLink, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { profileMenuItems } from '@/config';
import Link from 'next/link';

type DesktopProfileMenuProps = {
  currentPathname: string;
  userFullName: string;
};

const DesktopProfileMenu = ({
  currentPathname,
  userFullName,
}: DesktopProfileMenuProps) => {
  const { palette } = useTheme();
  const t = useTranslations('profile');

  return (
    <Box
      sx={{
        backgroundColor: palette.grey[50],
        display: { xs: 'none', md: 'flex' },
        position: 'relative',
        minHeight: '60vh',
      }}
    >
      <Box
        sx={{
          flexDirection: 'column',
          padding: '80px 0',
          width: { md: '347px' },
          flexGrow: { md: 0 },
          flexShrink: { md: 0 },
          position: 'sticky',
          overflowY: 'auto',
          top: 50,
          scrollbarWidth: 'thin',
        }}
      >
        <Box sx={{ marginBottom: 8 }}>
          <Typography
            variant='h5'
            sx={{
              padding: '0px 32px',
              verticalAlign: 'middle',
            }}
          >
            {userFullName}
          </Typography>
        </Box>
        {profileMenuItems.map(
          ({ label, href }: { label: string; href: string }, index: number) => {
            const isCurrent = currentPathname === href;

            return (
              <MuiLink
                component={Link}
                key={index}
                href={href}
                sx={{ textDecoration: 'none', color: palette.text.primary }}
              >
                <Box
                  sx={{
                    borderRight: isCurrent
                      ? '3px solid ' + palette.primary.main
                      : 'unset',
                    backgroundColor: isCurrent
                      ? palette.primary.main + '14'
                      : 'unset',
                    backgroundOpacity: isCurrent ? 0.08 : 1,
                    padding: '10px 32px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: isCurrent ? palette.primary.dark : 'inherit',
                  }}
                >
                  {t(label)}
                </Box>
              </MuiLink>
            );
          }
        )}
      </Box>
    </Box>
  );
};

export default DesktopProfileMenu;
