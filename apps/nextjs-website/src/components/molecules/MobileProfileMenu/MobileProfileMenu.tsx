'use client';
import React, { useCallback, useState } from 'react';
import { IconButton, Link as MuiLink, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { Stack } from '@mui/system';
import { profileMenuItems } from '@/config';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { TreeView } from '@mui/lab';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

type MobileProfileMenuProps = {
  userFullName: string | null;
};

const MobileProfileMenu = ({ userFullName }: MobileProfileMenuProps) => {
  const { palette } = useTheme();
  const t = useTranslations('profile');

  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => setOpen(!open), [open]);

  return (
    <Stack
      sx={{
        display: { md: 'none' },
        backgroundColor: palette.grey[50],
        position: 'relative',
      }}
      flexGrow={1}
      alignItems='center'
      direction='row'
      gap={1}
      justifyContent='flex-start'
    >
      <EContainer>
        <Stack
          direction='column'
          justifyContent='center'
          alignItems='stretch'
          spacing={1}
          onClick={handleClick}
        >
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            {t('hello')} {userFullName}
            <IconButton size='small' sx={{ ml: 1 }}>
              {open ? <ArrowDropUp /> : <ArrowDropDown />}
            </IconButton>
          </Typography>

          {open && (
            <TreeView>
              {profileMenuItems.map(
                (
                  { label, href }: { label: string; href: string },
                  index: number
                ) => {
                  return (
                    <Typography
                      key={index}
                      variant='body1'
                      component={MuiLink}
                      href={href}
                      style={{
                        color: 'black',
                        display: 'block',
                        textDecoration: 'none',
                      }}
                      my={1}
                      mx={2}
                    >
                      {t(label)}
                    </Typography>
                  );
                }
              )}
            </TreeView>
          )}
        </Stack>
      </EContainer>
    </Stack>
  );
};

export default MobileProfileMenu;
