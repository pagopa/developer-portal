import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Stack, Typography, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import ChatbotHistoryNavigationLink from '@/components/atoms/ChatbotHistoryNavigationLink/ChatbotHistoryNavigationLink';

export type SessionNavigationData = {
  sessionId: string;
  sessionTitle: string;
};

type ChatbotHistoryNavigationMenuProps = {
  previousSession?: SessionNavigationData;
  nextSession?: SessionNavigationData;
};

const ChatbotHistoryNavigationMenu = ({
  previousSession,
  nextSession,
}: ChatbotHistoryNavigationMenuProps) => {
  const t = useTranslations();
  const { palette } = useTheme();
  const textColor = palette.text.secondary;

  return (
    <Stack direction='row' justifyContent='space-between'>
      {previousSession && (
        <Stack direction='column' spacing={1}>
          <Typography component='h6' fontSize='0.875rem' color={textColor}>
            {t('chatBot.previousChat')}
          </Typography>
          <Stack direction='row' spacing={1}>
            <ArrowBack sx={{ color: textColor }} />
            <ChatbotHistoryNavigationLink
              sessionId={previousSession.sessionId}
              sessionTitle={previousSession.sessionTitle}
            />
          </Stack>
        </Stack>
      )}
      {nextSession && (
        <Stack direction='column' spacing={1}>
          <Typography component='h6' fontSize='0.875rem' color={textColor}>
            {t('chatBot.previousChat')}
          </Typography>
          <Stack direction='row' spacing={1}>
            <ChatbotHistoryNavigationLink
              sessionId={nextSession.sessionId}
              sessionTitle={nextSession.sessionTitle}
            />
            <ArrowForward sx={{ color: textColor }} />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default ChatbotHistoryNavigationMenu;
