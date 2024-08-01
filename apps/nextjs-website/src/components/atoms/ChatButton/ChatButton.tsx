'use client';
import Fab from '@mui/material/Fab';
import { Badge, Box, useTheme } from '@mui/material';
import IconWrapper from '../IconWrapper/IconWrapper';

type ChatButtonProps = {
  isChatOpen: boolean;
  hasNewMessages: boolean;
  onOpenChat: (event: React.MouseEvent<HTMLButtonElement>) => null;
};

const ChatButton = ({
  isChatOpen,
  hasNewMessages,
  onOpenChat,
}: ChatButtonProps) => {
  const { palette } = useTheme();
  return (
    <Box sx={{ opacity: isChatOpen ? 0 : 1 }}>
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
        <Box
          sx={{
            backgroundColor: palette.text.primary,
            padding: '3px',
            borderRadius: '100%',
          }}
        >
          <Fab
            aria-label='chat'
            onClick={onOpenChat}
            sx={{
              backgroundColor: 'white !important',
              paddingTop: 1,
            }}
          >
            <IconWrapper
              icon={'/icons/chatbotAvatar.svg'}
              isSvg={true}
              color={palette.text.secondary}
              size={48}
            />
          </Fab>
        </Box>
      </Badge>
    </Box>
  );
};

export default ChatButton;
