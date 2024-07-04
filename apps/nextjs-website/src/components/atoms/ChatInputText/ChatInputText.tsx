import { SendOutlined } from '@mui/icons-material';
import { IconButton, InputBase, Paper, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import { ChangeEvent, FormEvent, useState } from 'react';

type ChatInputTextProps = {
  onSubmit: (message: string) => null;
};

const ChatInputText = ({ onSubmit }: ChatInputTextProps) => {
  const t = useTranslations();
  const [message, setMessage] = useState('');
  const { palette } = useTheme();
  const iconColor = palette.grey[700];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
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
    <Paper
      component='form'
      onSubmit={handleSubmit}
      sx={{
        p: '4px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 'auto',
      }}
    >
      <InputBase
        fullWidth
        placeholder={t('chatBot.writeNewMessagePlaceholder')}
        value={message}
        onChange={handleChange}
        sx={{ ml: 1 }}
      />
      <IconButton
        aria-label='send'
        onClick={submit}
        sx={{ p: '10px', color: iconColor, cursor: 'pointer' }}
      >
        <SendOutlined />
      </IconButton>
    </Paper>
  );
};

export default ChatInputText;
