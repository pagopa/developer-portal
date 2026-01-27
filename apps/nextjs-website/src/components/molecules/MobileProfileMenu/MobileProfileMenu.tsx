'use client';
import { profileMenuItems } from '@/config';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  MenuList,
  Link as MuiLink,
  Typography,
  useTheme,
  Stack,
  useMediaQuery,
  Theme,
} from '@mui/material';

type MobileProfileMenuProps = {
  userFullName: string | null;
};

const MobileProfileMenu = ({ userFullName }: MobileProfileMenuProps) => {
  const { palette } = useTheme();
  const t = useTranslations('profile');
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setOpen(false);
    }
  }, [isDesktop]);

  const items = (
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
  );

  return (
    <Stack
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 11,
        display: { md: 'none' },
        backgroundColor: palette.grey[50],
        borderBottom: `1px solid ${palette.divider}`,
        width: 1,
      }}
    >
      <EContainer>
        <Stack
          direction='row'
          justifyContent='center'
          alignItems='center'
          spacing={1}
          onClick={handleClick}
          sx={{ py: 2, cursor: 'pointer' }}
        >
          <Typography
            variant='body2'
            sx={{ fontWeight: 600, color: palette.primary.main }}
          >
            {t('title')}
          </Typography>
          <IconButton size='small' sx={{ ml: 1, color: palette.primary.main }}>
            <ArrowDropDownOutlinedIcon
              sx={{ width: 24, height: 24 }}
            ></ArrowDropDownOutlinedIcon>
          </IconButton>
        </Stack>
      </EContainer>

      {!isDesktop && (
        <Dialog open={open} onClose={handleClick} fullScreen>
          <DialogTitle
            component={Stack}
            direction='row'
            alignItems='center'
            justifyContent='flex-start'
            sx={{
              padding: '12px 24px',
            }}
          >
            <Typography
              variant='h6'
              sx={{
                flexGrow: 1,
                flexShrink: 0,
                fontSize: '16px!important',
                verticalAlign: 'middle',
                color: palette.primary.main,
              }}
            >
              {t('title')}
            </Typography>
            <IconButton
              aria-label='close'
              onClick={handleClick}
              sx={{
                color: palette.primary.main,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ px: 0 }}>
            <Typography
              variant='h6'
              noWrap
              sx={{ fontSize: '22px', fontWeight: 600, padding: '12px 24px' }}
            >
              {userFullName}
            </Typography>
            {items}
          </DialogContent>
        </Dialog>
      )}
    </Stack>
  );
};

export default MobileProfileMenu;
