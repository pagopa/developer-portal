import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { Language } from '@mui/icons-material';

export type LanguageSelectorProps = {
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

  const currentLocaleLabel =
    locales.find((locale) => locale.code === currentLocale)?.label ||
    currentLocale.toUpperCase();

  return (
    <>
      <Button
        disabled={locales.length <= 1}
        onClick={handleClick}
        startIcon={<Language />}
        sx={{
          paddingX: 2,
          textTransform: 'none',
          color: 'inherit',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
        disableRipple
      >
        {currentLocaleLabel}
      </Button>
      <Menu
        sx={{
          marginTop: '5px',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
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
