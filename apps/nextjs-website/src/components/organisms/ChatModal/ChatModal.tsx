import Chat from '@/components/molecules/Chat/Chat';
import ChatButton from '@/components/atoms/ChatButton/ChatButton';
import { Close } from '@mui/icons-material';
// import { useUser } from '@/helpers/user.helper';
import { Box, IconButton, Popover, Stack, Typography } from '@mui/material';
import React from 'react';
import { useTranslations } from 'next-intl';

type ChatModalProps = {
  chatMessages: { message: string; sender?: string; timestamp: string }[];
};

const ChatModal = ({ chatMessages }: ChatModalProps) => {
  const t = useTranslations();
  // const { user, loading } = useUser(); // PENDING: Uncomment this line when chatbot APIs are ready
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
    <div>
      <ChatButton
        aria-describedby={id}
        isChatOpen={open}
        onOpenChat={handleClick}
        hasNewMessages={false}
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
        sx={{ maxWidth: '60%' }}
      >
        <Box
          bgcolor={'black'}
          padding={'0.75rem'}
          borderRadius={3}
          minWidth='40rem'
        >
          <Stack
            direction='row'
            justifyContent='space-between'
            paddingBottom={'0.5rem'}
            paddingX={'0.5rem'}
          >
            <Typography
              variant='h5'
              fontWeight='normal'
              sx={{ color: 'white' }}
            >
              {t('chatBot.title')}
            </Typography>
            <IconButton onClick={handleClose}>
              <Close sx={{ color: 'white' }} />
            </IconButton>
          </Stack>
          <Chat chatMessages={chatMessages} />
        </Box>
      </Popover>
    </div>
  );
};

export default ChatModal;
