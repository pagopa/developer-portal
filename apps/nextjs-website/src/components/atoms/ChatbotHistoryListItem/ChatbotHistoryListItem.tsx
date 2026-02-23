import { chatbotListDateOptions } from '@/config';
import { Session } from '@/lib/chatbot/queries';
import { ListItem, ListItemButton, Typography, useTheme } from '@mui/material';
import { useTranslations, useFormatter } from 'next-intl';
import { useParams } from 'next/navigation';

type ChatbotHistoryListItemProps = {
  session: Session;
};

const ChatbotHistoryListItem = ({ session }: ChatbotHistoryListItemProps) => {
  const locale = useParams<{ locale: string }>().locale;
  const { palette } = useTheme();
  const t = useTranslations();
  const format = useFormatter();
  const formattedDate = format.dateTime(
    new Date(session.createdAt),
    chatbotListDateOptions
  );

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
        href={`/${locale}/profile/chatbot-history?sessionId=${session.id}`}
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
