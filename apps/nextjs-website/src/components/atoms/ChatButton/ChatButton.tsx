'use client';
import Fab from '@mui/material/Fab';
import { Box, useTheme } from '@mui/material';
import IconWrapper from '../IconWrapper/IconWrapper';

type ChatButtonProps = {
  isChatOpen: boolean;
  onOpenChat: (event: React.MouseEvent<HTMLButtonElement>) => null;
  size: 'medium' | 'large';
};

const ChatButton = ({ isChatOpen, onOpenChat, size }: ChatButtonProps) => {
  const { palette } = useTheme();
  return (
    <Box sx={{ opacity: isChatOpen ? 0 : 1 }}>
      <Fab
        aria-label='chat'
        onClick={onOpenChat}
        size={size}
        sx={{
          borderStyle: 'solid',
          borderColor: palette.text.primary,
          borderWidth: 3,
          backgroundColor: palette.background.paper,
          paddingTop: '0.5rem',
        }}
      >
        <IconWrapper
          icon={'/icons/chatbotAvatar.svg'}
          useSrc={true}
          color={palette.text.secondary}
          size={size === 'large' ? 48 : 40}
        />
      </Fab>
    </Box>
  );
};

export default ChatButton;
