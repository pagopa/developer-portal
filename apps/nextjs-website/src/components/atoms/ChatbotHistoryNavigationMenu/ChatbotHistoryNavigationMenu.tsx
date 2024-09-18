import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Link, Stack, Typography, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';

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
  const { palette, typography } = useTheme();
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
            <Link
              maxWidth='15rem'
              textOverflow='ellipsis'
              fontSize='1.125rem'
              fontWeight='600'
              fontFamily={typography.fontFamily}
              color={textColor}
              component='span'
              noWrap
              sx={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              {previousSession.sessionTitle}
            </Link>
          </Stack>
        </Stack>
      )}
      {nextSession && (
        <Stack direction='column' spacing={1}>
          <Typography component='h6' fontSize='0.875rem' color={textColor}>
            {t('chatBot.previousChat')}
          </Typography>
          <Stack direction='row' spacing={1}>
            <Link
              maxWidth='15rem'
              textOverflow='ellipsis'
              color={textColor}
              fontSize='1.125rem'
              fontWeight='600'
              fontFamily={typography.fontFamily}
              component='span'
              noWrap
              sx={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              {nextSession.sessionTitle}
            </Link>
            <ArrowForward sx={{ color: textColor }} />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default ChatbotHistoryNavigationMenu;
