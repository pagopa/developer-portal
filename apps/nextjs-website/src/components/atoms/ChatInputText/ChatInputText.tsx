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

const MESSAGE_MAX_CHARS = 800;

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
    setMessage(event.target.value.slice(0, MESSAGE_MAX_CHARS));
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
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  };

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
        inputRef={(input) => input && input.focus()}
        fullWidth
        placeholder={t('chatBot.writeNewMessagePlaceholder')}
        value={message}
        onChange={handleChange}
        multiline
        maxRows={isDesktop ? 8 : 4}
        endAdornment={
          <Box
            sx={{
              color: palette.action.disabled,
              fontSize: '0.875rem',
              marginLeft: '0.5rem',
            }}
          >
            {`${message.length}/${MESSAGE_MAX_CHARS}`}
          </Box>
        }
        sx={{
          alignItems: 'flex-end',
          borderWidth: '2px',
          paddingX: { xs: 1.5, md: 2 },
          paddingY: 1,
          borderRadius: 2,
          borderStyle: 'solid',
          borderColor: message.length ? palette.primary.main : disabledColor,
          fontSize: '0.875rem',
        }}
      />
      <IconButton
        aria-label='send'
        onClick={submit}
        disabled={!message || sendDisabled}
        sx={{
          color: palette.primary.main,
          cursor: 'pointer',
          marginLeft: 0.5,
        }}
      >
        <Send
          sx={{
            height: '1.5rem',
            width: '1.5rem',
          }}
        />
      </IconButton>
    </Box>
  );
};

export default ChatInputText;
