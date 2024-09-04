import ChatbotHistoryList from '@/components/molecules/ChatbotHistoryList/ChatbotHistoryList';
import { PaginatedSessions } from '@/lib/chatbot/queries';
import { Pagination, Stack } from '@mui/material';
import { useEffect } from 'react';

type ChatbotHistoryLayoutProps = {
  paginatedSessions: PaginatedSessions;
  getSessions: (page: number) => null;
};

const ChatbotHistoryLayout = ({
  paginatedSessions,
  getSessions,
}: ChatbotHistoryLayoutProps) => {
  useEffect(() => {
    getSessions(1);
  });

  return (
    <Stack direction='column' alignItems='center'>
      <ChatbotHistoryList sessionsList={paginatedSessions.items} />
      <Pagination
        count={paginatedSessions.pages}
        page={paginatedSessions.page}
        onChange={(_, page) => getSessions(page)}
      />
    </Stack>
  );
};

export default ChatbotHistoryLayout;
