'use client';
import Fab from '@mui/material/Fab';
import { Box, Theme, useMediaQuery, useTheme } from '@mui/material';
import IconWrapper from '../IconWrapper/IconWrapper';

type ChatButtonProps = {
  isChatOpen: boolean;
  onOpenChat: (event: React.MouseEvent<HTMLButtonElement>) => null;
};

const ChatButton = ({ isChatOpen, onOpenChat }: ChatButtonProps) => {
  const { palette } = useTheme();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  return (
    <Box sx={{ opacity: isChatOpen ? 0 : 1 }}>
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
          size={isDesktop ? 'large' : 'medium'}
          sx={{
            backgroundColor: 'white !important',
            paddingTop: 1,
          }}
        >
          <IconWrapper
            icon={'/icons/chatbotAvatar.svg'}
            isSvg={true}
            color={palette.text.secondary}
            size={isDesktop ? 48 : 40}
          />
        </Fab>
      </Box>
    </Box>
  );
};

export default ChatButton;
