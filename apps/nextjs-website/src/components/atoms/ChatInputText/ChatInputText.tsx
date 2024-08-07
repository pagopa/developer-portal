import { Send } from '@mui/icons-material';
import {
  Box,
  IconButton,
  InputBase,
  Theme,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { ChangeEvent, FormEvent, KeyboardEvent, useState } from 'react';

type ChatInputTextProps = {
  onSubmit: (message: string) => null;
  sendDisabled?: boolean;
};

const ChatInputText = ({ onSubmit, sendDisabled }: ChatInputTextProps) => {
  const t = useTranslations();
  const [message, setMessage] = useState('');
  const { palette } = useTheme();
  const disabledColor = palette.action.disabled;
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value.slice(0, 800));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const submit = () => {
    onSubmit(message);
    setMessage('');
  };

  const onEnterKeyDownSubmitForm = (event: KeyboardEvent<HTMLFormElement>) => {
    console.log(event.key);
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  };

  const iconButtonSize = isDesktop ? '1.8rem' : '1.65rem';
  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      onKeyDown={onEnterKeyDownSubmitForm}
      sx={{
        display: 'flex',
        alignItems: 'end',
        width: 'auto',
        paddingLeft: 2,
        paddingRight: 1,
        paddingY: 2,
        borderTop: '3px solid',
        borderTopColor: message.length ? palette.primary.main : disabledColor,
        backgroundColor: palette.background.paper,
      }}
    >
      <InputBase
        fullWidth
        placeholder={t('chatBot.writeNewMessagePlaceholder')}
        value={message}
        onChange={handleChange}
        multiline
        maxRows={isDesktop ? 8 : 4}
        endAdornment={
          <span
            style={{
              color: palette.action.disabled,
              fontSize: isDesktop ? '1rem' : '0.875rem',
              marginLeft: '0.5rem',
            }}
          >
            {message.length}/800
          </span>
        }
        sx={{
          alignItems: 'flex-end',
          borderWidth: '2px',
          paddingX: isDesktop ? 2 : 1.5,
          paddingY: 1,
          borderRadius: 2,
          borderStyle: 'solid',
          borderColor: message.length ? palette.primary.main : disabledColor,
          fontSize: isDesktop ? '1rem' : '0.875rem',
        }}
      />
      <IconButton
        aria-label='send'
        onClick={submit}
        disabled={!message || sendDisabled}
        sx={{
          p: '10px',
          color: palette.primary.main,
          cursor: 'pointer',
          marginLeft: 0.5,
          marginBottom: isDesktop ? 0.85 : 0,
        }}
      >
        <Send sx={{ height: iconButtonSize, width: iconButtonSize }} />
      </IconButton>
    </Box>
  );
};

export default ChatInputText;
