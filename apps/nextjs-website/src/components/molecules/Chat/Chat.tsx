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
import { ChatbotWriting } from '@/components/atoms/ChatbotWriting/ChatbotWriting';
import { ChatSkeleton } from '@/components/atoms/ChatSkeleton/ChatSkeleton';
import { useUser } from '@/helpers/user.helper';
import { baseUrl } from '@/config';
import AlertPart from '@/components/atoms/AlertPart/AlertPart';
import { ChatbotErrorsType } from '@/helpers/chatbot.helper';
import ChatbotFeedbackForm from '@/components/molecules/ChatbotFeedbackForm/ChatbotFeedbackForm';
import { useParams } from 'next/navigation';

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
  const locale = useParams<{ locale: string }>().locale;
  const t = useTranslations();
  const { palette } = useTheme();
  const [instantScroll, setInstantScroll] = useState(scrollToBottom);
  const { user } = useUser();
  const [sessionId, setSessionId] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [isFeedbackFormVisible, setIsFeedbackFormVisible] = useState(false);
  const messages = useMemo(
    () => [
      firstMessage(
        user
          ? t('chatBot.welcomeMessage')
          : t('chatBot.guestMessage', { host: `${baseUrl}/${locale}` }),
        mustFillFeedbackForm
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
                mustFillFeedbackForm: mustFillFeedbackForm,
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
                mustFillFeedbackForm: mustFillFeedbackForm,
              }
            : null,
        ])
      ),
    ],
    [queries, t, user, mustFillFeedbackForm]
  ) satisfies Message[];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [queriesCount, setQueriesCount] = useState(0);

  useEffect(() => {
    if (messages.length !== queriesCount) {
      setQueriesCount(messages.length);
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({
          behavior: instantScroll ? 'auto' : 'smooth',
        });
      }
    }
    setInstantScroll(false);
  }, [
    messages,
    instantScroll,
    setInstantScroll,
    isAwaitingResponse,
    queriesCount,
  ]);

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
              href={`/${locale}/profile/chatbot-history`}
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
      {isFeedbackFormVisible && (
        <>
          <ChatbotFeedbackForm
            sessionId={sessionId}
            id={id}
            onClose={() => {
              setIsFeedbackFormVisible(false);
              return null;
            }}
            onSend={onSendFeedback}
            setIsFormVisible={(isVisible) => {
              setIsFeedbackFormVisible(isVisible);
              return null;
            }}
          />
        </>
      )}
      <>
        <Stack
          direction={'column'}
          sx={{
            overflow: 'auto',
            paddingRight: '0.5rem',
            paddingX: { xs: 1, md: 4 },
            backgroundColor: palette.background.paper,
            height: isFeedbackFormVisible ? 0 : '100%',
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
                mustFillFeedbackForm={mustFillFeedbackForm}
                onToggleNegativeFeedback={(negativeFeedback) => {
                  setSessionId(message.sessionId);
                  setId(message.id);
                  if (mustFillFeedbackForm) {
                    if (negativeFeedback) setIsFeedbackFormVisible(true);
                  } else {
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
          {isAwaitingResponse && <ChatbotWriting />}
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
        {!disabled && !isFeedbackFormVisible && (
          <ChatInputText
            onSubmit={onSendQuery}
            sendDisabled={isAwaitingResponse}
          />
        )}
      </>
    </>
  );
};

export default Chat;

function firstMessage(text: string, mustFillFeedbackForm: boolean): Message {
  return {
    id: '',
    text: text,
    isQuestion: false,
    sessionId: '',
    hasNegativeFeedback: false,
    mustFillFeedbackForm: mustFillFeedbackForm,
  };
}
