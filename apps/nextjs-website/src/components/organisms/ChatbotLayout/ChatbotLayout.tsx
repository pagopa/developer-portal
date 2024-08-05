import Chat from '@/components/molecules/Chat/Chat';
import ChatButton from '@/components/atoms/ChatButton/ChatButton';
import { Close } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Popover,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { Query } from '@/lib/chatbot/queries';
import { useTranslations } from 'next-intl';

type ChatbotLayoutProps = {
  queries: Query[];
  onSendQuery: (query: string) => null;
  sendDisabled?: boolean;
};

const ChatbotLayout = ({
  queries,
  onSendQuery,
  sendDisabled,
}: ChatbotLayoutProps) => {
  const t = useTranslations();
  const { palette } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    return null;
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'chat-modal' : undefined;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
      }}
    >
      <ChatButton
        aria-describedby={id}
        isChatOpen={open}
        onOpenChat={handleClick}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        disableScrollLock
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'transparent',
              borderRadius: 3,
              width: '40%',
              minWidth: '48rem',
            },
          },
        }}
      >
        <Box bgcolor='black' borderRadius={3} minWidth='40rem'>
          <Stack
            direction='row'
            justifyContent='space-between'
            paddingY={'0.5rem'}
            paddingX={'1rem'}
          >
            <Typography
              variant='h5'
              fontWeight='bold'
              sx={{ color: palette.primary.contrastText }}
            >
              {t('chatBot.title')}
            </Typography>
            <IconButton onClick={handleClose}>
              <Close sx={{ color: palette.primary.contrastText }} />
            </IconButton>
          </Stack>
          <Chat
            queries={queries}
            onSendQuery={onSendQuery}
            sendDisabled={sendDisabled}
            scrollToBottom
          />
        </Box>
      </Popover>
    </Box>
  );
};

export default ChatbotLayout;
