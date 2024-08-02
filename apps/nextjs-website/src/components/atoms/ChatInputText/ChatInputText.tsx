import { Send } from '@mui/icons-material';
import { alpha, Box, IconButton, InputBase, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import { ChangeEvent, FormEvent, useState } from 'react';

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

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
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
          <span style={{ color: alpha(palette.text.primary, 0.4) }}>
            {message.length}/800
          </span>
        }
        sx={{
          borderWidth: '2px',
          padding: 2,
          borderRadius: 2,
          borderStyle: 'solid',
          borderColor: message.length ? palette.primary.main : disabledColor,
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
          marginBottom: 1,
        }}
      >
        <Send />
      </IconButton>
    </Box>
  );
};

export default ChatInputText;
