import ChatHistoryMessage from '@/components/atoms/ChatHistoryMessage/ChatHistoryMessage';
import { Query } from '@/lib/chatbot/queries';
import { Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

type ChatHistoryMessagesProps = {
  queries: Query[];
  userName: string;
};

const ChatHistoryMessages = ({
  queries,
  userName,
}: ChatHistoryMessagesProps) => {
  const t = useTranslations();

  return (
    <Stack direction='column' width='100%' spacing={2}>
      {queries.map((query) => (
        <Stack key={query.id} direction='column' width='100%' spacing={2}>
          <ChatHistoryMessage
            text={query.question}
            timestamp={query.queriedAt}
            isQuestion={true}
            sender={userName}
          />
          {query.answer && query.createdAt && (
            <ChatHistoryMessage
              text={query.answer}
              timestamp={query.createdAt}
              isQuestion={false}
              sender={t('chatBot.title')}
            />
          )}
        </Stack>
      ))}
    </Stack>
  );
};

export default ChatHistoryMessages;
