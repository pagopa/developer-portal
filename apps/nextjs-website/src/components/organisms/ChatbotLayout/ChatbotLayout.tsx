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
import React, { useState } from 'react';
import { Query } from '@/lib/chatbot/queries';
import { useTranslations } from 'next-intl';
import { ChatbotErrorsType } from '@/helpers/chatbot.helper';
import { getChatbotHealthz } from '@/lib/chatbotApi';
import ChatbotFeedbackForm from '@/components/molecules/ChatbotFeedbackForm/ChatbotFeedbackForm';

type ChatbotLayoutProps = {
  queries: Query[];
  onSendQuery: (query: string) => null;
  onSendFeedback: (
    hasNegativeFeedback: boolean,
    sessionId: string,
    chatId: string
  ) => null;
  isAwaitingResponse: boolean;
  areChatbotQueriesLoaded: boolean;
  error: ChatbotErrorsType | null;
  disabled?: boolean;
};

const ChatbotLayout = ({
  queries,
  onSendQuery,
  onSendFeedback,
  isAwaitingResponse,
  areChatbotQueriesLoaded,
  error,
  disabled,
}: ChatbotLayoutProps) => {
  const t = useTranslations();
  const { palette } = useTheme();
  const ref = React.useRef<HTMLElement | undefined>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | undefined>(
    undefined
  );
  const [formVisible, setFormVisible] = React.useState(false);
  const [contextRelevancy, setContextRelevancy] = useState(0);
  const [responseRelevancy, setResponseRelevancy] = useState(0);
  const [comment, setComment] = useState('');

  const handleClick = () => {
    if (!open) getChatbotHealthz();
    setAnchorEl(ref.current);
    return null;
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const closeForm = () => {
    setFormVisible(false);
    return null;
  };

  const open = Boolean(anchorEl);
  const id = open ? 'chat-modal' : undefined;

  return (
    <Box
      ref={ref}
      sx={{
        position: 'fixed',
        bottom: { xs: '1rem', md: '2rem' },
        right: { xs: '1rem', md: '2rem' },
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: { lg: 'none' } }}>
        <ChatButton
          aria-describedby={id}
          isChatOpen={open}
          onOpenChat={handleClick}
          size='medium'
        />
      </Box>
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <ChatButton
          aria-describedby={id}
          isChatOpen={open}
          onOpenChat={handleClick}
          size='large'
        />
      </Box>
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
        marginThreshold={0}
        disableScrollLock
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'transparent',
              borderRadius: { xs: 0, md: 3 },
              width: { xs: '100%', md: '40%' },
              height: { xs: '100%', md: '70vh' },
              maxHeight: { xs: '100%', md: '40rem' },
              margin: 0,
              maxWidth: { xs: '100%' },
              minWidth: { xs: 'auto', md: '48rem' },
            },
          },
        }}
      >
        <Stack
          direction='column'
          bgcolor={palette.text.primary}
          borderRadius={{ xs: 0, md: 3 }}
          minWidth={{ xs: 0, md: '40rem' }}
          height='100%'
        >
          <Stack
            direction='row'
            justifyContent='space-between'
            paddingY={'0.5rem'}
            paddingX={'1rem'}
          >
            <Typography
              variant='h5'
              fontWeight='bold'
              marginTop={{ xs: '0.5rem', md: 0 }}
              sx={{ color: palette.primary.contrastText }}
            >
              {t('chatBot.title')}
            </Typography>
            <IconButton onClick={handleClose}>
              <Close sx={{ color: palette.primary.contrastText }} />
            </IconButton>
          </Stack>
          {formVisible ? (
            <ChatbotFeedbackForm
              disabled={false}
              answerId={'0'}
              onClose={closeForm}
              contextRelevancy={contextRelevancy}
              setContextRelevancy={setContextRelevancy}
              responseRelevancy={responseRelevancy}
              setResponseRelevancy={setResponseRelevancy}
              comment={comment}
              setComment={setComment}
              //update with correct callback
              onSend={closeForm}
            />
          ) : (
            <Chat
              queries={queries}
              onSendQuery={onSendQuery}
              onSendFeedback={onSendFeedback}
              isAwaitingResponse={isAwaitingResponse}
              areChatbotQueriesLoaded={areChatbotQueriesLoaded}
              scrollToBottom={true}
              error={error}
              disabled={disabled}
            />
          )}
        </Stack>
      </Popover>
    </Box>
  );
};

export default ChatbotLayout;
