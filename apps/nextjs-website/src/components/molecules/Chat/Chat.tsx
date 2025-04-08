import ChatMessage, {
  Message,
} from '@/components/atoms/ChatMessage/ChatMessage';
import { Box, Button, Paper, Stack, useTheme } from '@mui/material';
import ChatInputText from '@/components/atoms/ChatInputText/ChatInputText';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { History } from '@mui/icons-material';
import { Query } from '@/lib/chatbot/queries';
import { compact } from 'lodash';
import { useTranslations } from 'next-intl';
import { ChatCatbotWriting } from '@/components/atoms/ChatChatbotWriting/ChatChatbotWriting';
import { ChatSkeleton } from '@/components/atoms/ChatSkeleton/ChatSkeleton';
import { useUser } from '@/helpers/user.helper';
import { baseUrl } from '@/config';
import AlertPart from '@/components/atoms/AlertPart/AlertPart';
import { ChatbotErrorsType } from '@/helpers/chatbot.helper';
import ChatbotFeedbackForm from '@/components/molecules/ChatbotFeedbackForm/ChatbotFeedbackForm';

type ChatProps = {
  queries: Query[];
  onSendQuery: (query: string) => null;
  onSendFeedback: (
    hasNegativeFeedback: boolean,
    sessionId: string,
    chatId: string,
    contextScore: number | null,
    responseScore: number | null,
    comment: string
  ) => null;
  mustFillFeedbackForm: boolean;
  scrollToBottom: boolean;
  isAwaitingResponse: boolean;
  areChatbotQueriesLoaded: boolean;
  error: ChatbotErrorsType | null;
  disabled?: boolean;
};

const Chat = ({
  queries,
  onSendQuery,
  onSendFeedback,
  mustFillFeedbackForm,
  scrollToBottom,
  isAwaitingResponse,
  areChatbotQueriesLoaded,
  error,
  disabled,
}: ChatProps) => {
  const t = useTranslations();
  const { palette } = useTheme();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [instantScroll, setInstantScroll] = useState(scrollToBottom);
  const { user } = useUser();
  const [sessionId, setSessionId] = useState<string>('');
  const [id, setId] = useState<string>('');
  const messages = useMemo(
    () => [
      firstMessage(
        user
          ? t('chatBot.welcomeMessage')
          : t('chatBot.guestMessage', { host: baseUrl })
      ),
      ...compact(
        queries.flatMap((q) => [
          q.question && q.queriedAt
            ? {
                id: q.id,
                text: q.question,
                isQuestion: true,
                sessionId: q.sessionId,
                timestamp: q.queriedAt,
                hasNegativeFeedback: false,
              }
            : null,
          q.answer && q.createdAt
            ? {
                id: q.id,
                text: q.answer,
                isQuestion: false,
                sessionId: q.sessionId,
                timestamp: q.createdAt,
                hasNegativeFeedback: q.badAnswer || false,
              }
            : null,
        ])
      ),
    ],
    [queries, t, user]
  ) satisfies Message[];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: instantScroll ? 'auto' : 'smooth',
      });
    }
    setInstantScroll(false);
  }, [queries, instantScroll, setInstantScroll]);

  return (
    <>
      {!disabled && (
        <Box
          sx={{
            backgroundColor: palette.background.paper,
            borderBottom: '2px solid',
            borderBottomColor: palette.action.disabled,
            width: 'auto',
          }}
        >
          <Stack direction={'row'} paddingY={'0.25rem'}>
            <Button
              href='/profile/chatbot-history'
              size='small'
              sx={{ margin: '0.4rem', paddingX: '0.4rem' }}
            >
              <History fontSize='small' />
              <span style={{ fontSize: '1rem', marginLeft: '0.5rem' }}>
                {t('chatBot.history')}
              </span>
            </Button>
          </Stack>
        </Box>
      )}
      {isFormVisible ? (
        <ChatbotFeedbackForm
          sessionId={sessionId}
          id={id}
          onClose={() => {
            setIsFormVisible(false);
            return null;
          }}
          onSend={onSendFeedback}
          setIsFormVisible={(isVisible) => {
            setIsFormVisible(isVisible);
            return null;
          }}
        />
      ) : (
        <>
          <Stack
            direction={'column'}
            sx={{
              overflow: 'auto',
              paddingRight: '0.5rem',
              paddingX: { xs: 1, md: 4 },
              backgroundColor: palette.background.paper,
              height: '100%',
            }}
          >
            {!messages.length && !areChatbotQueriesLoaded && <ChatSkeleton />}
            {messages.map((message, index) => (
              <Stack
                key={index}
                ref={index === messages.length - 1 ? scrollRef : null}
                direction='row'
                width='100%'
                justifyContent={message.isQuestion ? 'flex-end' : 'flex-start'}
                marginTop={index === 0 ? 2 : 0}
                marginBottom={2}
              >
                <ChatMessage
                  {...message}
                  onToggleNegativeFeedback={(negativeFeedback) => {
                    if (mustFillFeedbackForm && negativeFeedback)
                      setIsFormVisible(true);
                    else {
                      setSessionId(message.sessionId);
                      setId(message.id);
                      onSendFeedback(
                        negativeFeedback,
                        message.sessionId,
                        message.id,
                        null,
                        null,
                        ''
                      );
                    }
                    return null;
                  }}
                />
              </Stack>
            ))}
            {isAwaitingResponse && <ChatCatbotWriting />}
            {error && (
              <Paper
                elevation={4}
                sx={{ marginBottom: '1rem', height: 'auto', marginTop: '1rem' }}
              >
                <AlertPart
                  title={t('chatBot.errors.title')}
                  text={t(`chatBot.errors.${error}`)}
                  severity={'error'}
                  alertStyle={{
                    backgroundColor: palette.background.paper,
                    marginBottom: 0,
                  }}
                />
              </Paper>
            )}
          </Stack>
          {!disabled && (
            <ChatInputText
              onSubmit={onSendQuery}
              sendDisabled={isAwaitingResponse}
            />
          )}
        </>
      )}
    </>
  );
};

export default Chat;

function firstMessage(text: string): Message {
  return {
    id: '',
    text: text,
    isQuestion: false,
    sessionId: '',
    hasNegativeFeedback: false,
  };
}
