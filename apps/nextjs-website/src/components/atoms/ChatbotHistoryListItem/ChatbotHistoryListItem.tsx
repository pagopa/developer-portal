import { Session } from '@/lib/chatbot/queries';
import {
  ListItem,
  ListItemButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslations, useLocale } from 'next-intl';
import { formatDate } from '@/lib/dateUtils';

type ChatbotHistoryListItemProps = {
  session: Session;
};

const ChatbotHistoryListItem = ({ session }: ChatbotHistoryListItemProps) => {
  const { palette } = useTheme();
  const t = useTranslations();
  const locale = useLocale();
  const formattedDate = formatDate(new Date(session.createdAt), locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <ListItem sx={{ width: '100%', paddingX: 0 }}>
      <ListItemButton
        sx={{
          minHeight: '101px',
          '&:hover': {
            backgroundColor: '#E8EAEC',
          },
          display: 'block',
          width: '100%',
          alignContent: 'center',
          backgroundColor: '#fafafa',
        }}
        href={`/profile/chatbot-history?sessionId=${session.id}`}
      >
        <Typography
          color={palette.text.primary}
          fontSize='1rem'
          fontWeight='600'
          noWrap
          component='span'
          display='block'
          textOverflow='ellipsis'
        >
          {t('chatBot.sessionTitle') + formattedDate}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
};

export default ChatbotHistoryListItem;
