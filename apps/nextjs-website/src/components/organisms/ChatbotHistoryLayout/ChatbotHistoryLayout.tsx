import ChatbotHistoryList from '@/components/molecules/ChatbotHistoryList/ChatbotHistoryList';
import { PaginatedSessions } from '@/lib/chatbot/queries';
import { Pagination, Stack } from '@mui/material';
import { useEffect } from 'react';

type ChatbotHistoryLayoutProps = {
  paginatedSessions: PaginatedSessions;
  getSessionsByPage: (page: number) => null;
};

const ChatbotHistoryLayout = ({
  paginatedSessions,
  getSessionsByPage,
}: ChatbotHistoryLayoutProps) => {
  useEffect(() => {
    getSessionsByPage(1);
  });

  return (
    <Stack direction='column' alignItems='center'>
      <ChatbotHistoryList sessionsList={paginatedSessions.items} />
      <Pagination
        count={paginatedSessions.pages}
        page={paginatedSessions.page}
        onChange={(_, page) => getSessionsByPage(page)}
      />
    </Stack>
  );
};

export default ChatbotHistoryLayout;
