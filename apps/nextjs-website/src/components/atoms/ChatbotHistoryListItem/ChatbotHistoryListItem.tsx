import { defaultLocale } from '@/config';
import { Session } from '@/lib/chatbot/queries';
import {
  ListItem,
  ListItemButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

type DateFormatOptions = {
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
};

const DEFAULT_DATE_FORMAT = {
  locale: defaultLocale,
  options: {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  },
} satisfies DateFormatOptions;

type ChatbotHistoryListItemProps = {
  session: Session;
};

const ChatbotHistoryListItem = ({ session }: ChatbotHistoryListItemProps) => {
  const { palette } = useTheme();
  const formattedDate = new Intl.DateTimeFormat(
    DEFAULT_DATE_FORMAT.locale,
    DEFAULT_DATE_FORMAT.options
  ).format(new Date(session.createdAt));

  return (
    <ListItem>
      <ListItemButton
        sx={{ width: '100%' }}
        href={`/profile/${session.id}/session-history`}
      >
        <Stack direction='column' width='100%'>
          <Typography
            color={palette.text.secondary}
            fontSize='0.875rem'
            fontWeight='600'
          >
            {formattedDate}
          </Typography>
          <Typography
            color={palette.text.primary}
            fontSize='1rem'
            fontWeight='600'
            noWrap
            component='span'
            display='block'
            textOverflow='ellipsis'
          >
            {session.title}
          </Typography>
        </Stack>
      </ListItemButton>
    </ListItem>
  );
};

export default ChatbotHistoryListItem;
