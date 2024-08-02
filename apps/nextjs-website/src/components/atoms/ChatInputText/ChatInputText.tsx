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
import { ChangeEvent, FormEvent, useState } from 'react';

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

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
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
          <span style={{ color: palette.action.disabled }}>
            {message.length}/800
          </span>
        }
        sx={{
          borderWidth: '2px',
          paddingX: 2,
          paddingY: 1,
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
          marginLeft: 0.5,
        }}
      >
        <Send />
      </IconButton>
    </Box>
  );
};

export default ChatInputText;
