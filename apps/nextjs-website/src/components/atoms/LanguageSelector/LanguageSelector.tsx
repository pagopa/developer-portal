import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

type LanguageSelectorProps = {
  readonly locales: ReadonlyArray<{ code: string; label: string }>;
  readonly currentLocale: string;
};

const LanguageSelector = ({
  locales,
  currentLocale,
}: LanguageSelectorProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const currentLocaleName =
    locales.find((locale) => locale.code === currentLocale)?.name ||
    currentLocale.toUpperCase();

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        sx={{
          textTransform: 'none',
          color: 'inherit',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
        disableRipple
      >
        {currentLocaleName}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {locales.map((locale) => (
          <MenuItem
            key={locale.code}
            selected={locale.code === currentLocale}
            disableRipple
          >
            <a
              href={`/${locale.code}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {locale.label}
            </a>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;
