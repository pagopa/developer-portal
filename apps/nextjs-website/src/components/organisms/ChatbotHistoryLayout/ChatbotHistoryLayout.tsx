import ChatbotHistoryList from '@/components/molecules/ChatbotHistoryList/ChatbotHistoryList';
import { PaginatedSessions } from '@/lib/chatbot/queries';
import { Box, Pagination, Stack } from '@mui/material';

type ChatbotHistoryLayoutProps = {
  paginatedSessions: PaginatedSessions;
  getSessionsByPage: (page: number) => null;
};

const ChatbotHistoryLayout = ({
  paginatedSessions,
  getSessionsByPage,
}: ChatbotHistoryLayoutProps) => {
  return (
    <Stack direction='column'>
      <ChatbotHistoryList sessionsList={paginatedSessions.items} />
      <Box display='flex' marginY='1rem' width='100%' justifyContent='center'>
        <Pagination
          count={paginatedSessions.pages}
          page={paginatedSessions.page}
          onChange={(_, page) => getSessionsByPage(page)}
          hidePrevButton={paginatedSessions.page === 1}
          hideNextButton={paginatedSessions.page === paginatedSessions.pages}
        />
      </Box>
    </Stack>
  );
};

export default ChatbotHistoryLayout;
