import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

type LanguageSelectorProps = {
  readonly locales: ReadonlyArray<{ code: string; name: string }>;
  readonly currentLocale: string;
  // eslint-disable-next-line functional/no-return-void
  readonly onLocaleChange: (locale: string) => void;
};

const LanguageSelector = ({
  locales,
  currentLocale,
  onLocaleChange,
}: LanguageSelectorProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLocaleSelect = (locale: string) => {
    onLocaleChange(locale);
    handleClose();
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
            onClick={() => handleLocaleSelect(locale.code)}
            selected={locale.code === currentLocale}
            disableRipple
          >
            {locale.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;
