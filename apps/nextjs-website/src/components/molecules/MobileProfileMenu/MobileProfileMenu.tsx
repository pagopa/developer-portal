'use client';
import React, { useCallback, useState } from 'react';
import {
  IconButton,
  Link as MuiLink,
  MenuItem,
  useTheme,
  Collapse,
  MenuList,
  ClickAwayListener,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { Stack } from '@mui/system';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { profileMenuItems } from '@/config';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import Link from 'next/link';

type MobileProfileMenuProps = {
  userFullName: string | null;
};

const MobileProfileMenu = ({ userFullName }: MobileProfileMenuProps) => {
  const { palette } = useTheme();
  const t = useTranslations('profile');

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Stack
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 101,
          display: { md: 'none' },
          backgroundColor: palette.grey[50],
          borderBottom: `1px solid ${palette.divider}`,
          width: 1,
        }}
      >
        <EContainer>
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='flex-start'
            onClick={handleClick}
            sx={{ py: 2, cursor: 'pointer' }}
          >
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              {`${t('hello')} ${userFullName}`}
            </Typography>
            <IconButton size='small' sx={{ ml: 1 }}>
              <ArrowDropDownOutlinedIcon
                sx={{ width: 24, height: 24 }}
              ></ArrowDropDownOutlinedIcon>
            </IconButton>
          </Stack>
        </EContainer>

        <Collapse in={open} mountOnEnter unmountOnExit>
          <MenuList sx={{ flexDirection: 'column', gap: 2, width: 1 }}>
            {profileMenuItems.map(({ label, href }, index: number) => (
              <MenuItem key={index} onClick={handleClose} sx={{ p: 0 }}>
                <MuiLink
                  component={Link}
                  href={href}
                  sx={{
                    alignSelf: 'stretch',
                    textDecoration: 'none',
                    color: palette.text.primary,
                    py: 1,
                    pl: 6,
                  }}
                >
                  {t(label)}
                </MuiLink>
              </MenuItem>
            ))}
          </MenuList>
        </Collapse>
      </Stack>
    </ClickAwayListener>
  );
};

export default MobileProfileMenu;
