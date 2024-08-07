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
      <Fab
        aria-label='chat'
        onClick={onOpenChat}
        size={isDesktop ? 'large' : 'medium'}
        sx={{
          borderStyle: 'solid',
          borderColor: palette.text.primary,
          borderWidth: 3,
          backgroundColor: 'white !important',
          paddingTop: 0.5,
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
  );
};

export default ChatButton;
