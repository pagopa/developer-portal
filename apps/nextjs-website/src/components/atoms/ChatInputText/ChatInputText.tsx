import { Send } from '@mui/icons-material';
import {
  alpha,
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
  const disabledColor = alpha(palette.text.primary, 0.3);

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

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      onKeyDown={onEnterKeyDownSubmitForm}
      sx={{
        display: 'flex',
        alignItems: 'end',
        width: 'auto',
        padding: 2,
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
        maxRows={8}
        endAdornment={
          <Box
            sx={{
              color: alpha(palette.text.primary, 0.4),
              fontSize: { xs: '0.875rem', md: '1rem' },
              marginLeft: '0.5rem',
            }}
          >
            {message.length}/800
          </Box>
        }
        sx={{
          alignItems: 'flex-end',
          borderWidth: '2px',
          padding: { xs: 1.5, md: 2 },
          borderRadius: 2,
          borderStyle: 'solid',
          borderColor: message.length ? palette.primary.main : disabledColor,
          fontSize: { xs: '0.875rem', md: '1rem' },
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
          marginBottom: { xs: 0, md: 0.85 },
        }}
      >
        <Send
          sx={{
            height: { xs: '1.65rem', md: '1.8rem' },
            width: { xs: '1.65rem', md: '1.8rem' },
          }}
        />
      </IconButton>
    </Box>
  );
};

export default ChatInputText;
