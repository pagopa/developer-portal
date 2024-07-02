'use client';
import Fab from '@mui/material/Fab';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import { Badge, Box } from '@mui/material';

type ChatButtonProps = {
  chatOpen: boolean;
  hasNewMessages: boolean;
  onOpenChat: (event: React.MouseEvent<HTMLButtonElement>) => null;
};

const ChatButton = ({
  chatOpen,
  hasNewMessages,
  onOpenChat,
}: ChatButtonProps) => {
  return (
    <Box sx={{ opacity: chatOpen ? 0 : 1 }}>
      <Badge
        badgeContent={hasNewMessages ? 1 : 0}
        color='success'
        overlap='circular'
        variant='dot'
        sx={{
          '& .MuiBadge-badge': {
            fontSize: 9,
            height: 15,
            minWidth: 15,
            borderRadius: 20,
            zIndex: 1051,
          },
        }}
      >
        <Box bgcolor={'black'} borderRadius={100} padding={'3px'}>
          <Fab aria-label={'chat'} color={'primary'} onClick={onOpenChat}>
            <QuestionAnswerOutlinedIcon />
          </Fab>
        </Box>
      </Badge>
    </Box>
  );
};

export default ChatButton;
