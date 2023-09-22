import { useRef, useState } from 'react';
import { Menu, MenuItem, Typography, Box, Stack } from '@mui/material';
import { ButtonNaked } from './ButtonNaked';

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

export interface Language {
  id: string | number;
  value: string;
}

export interface LangSwitchProps {
  languages: Language[];
  // eslint-disable-next-line functional/no-return-void
  onLanguageChanged: (lang: Language) => void;
  activeLanguage: Language;
}

export function LangSwitch({
  languages,
  onLanguageChanged,
  activeLanguage,
}: LangSwitchProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((open) => !open);
  };

  const anchorEl = useRef(null);

  return (
    <Stack display='flex' flexDirection='column' aria-label='cambia la lingua'>
      <ButtonNaked
        sx={{
          color: 'text.primary',
          height: 'auto',
          display: 'flex',
        }}
        aria-label='lingua'
        aria-haspopup='true'
        aria-expanded={menuOpen}
        onClick={toggleMenu}
      >
        <Box ref={anchorEl}>
          <Typography color='inherit' variant='subtitle2'>
            {activeLanguage.value}
          </Typography>
        </Box>

        {menuOpen ? (
          <KeyboardArrowUpRoundedIcon fontSize='small' />
        ) : (
          <KeyboardArrowDownRoundedIcon fontSize='small' />
        )}
      </ButtonNaked>
      {!!languages?.length && anchorEl && (
        <Menu
          anchorEl={anchorEl?.current}
          sx={{ display: 'flex' }}
          open={menuOpen}
          onClose={() => {
            setMenuOpen(false);
          }}
          MenuListProps={{ 'aria-labelledby': 'lang-menu-button' }}
        >
          {languages.map((language) => (
            <MenuItem
              aria-label={language.value}
              key={language.id}
              onClick={() => {
                onLanguageChanged(language);
              }}
            >
              {language.value}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Stack>
  );
}
