import {
  capitalize,
  Divider,
  List,
  ListItem,
  Palette,
  Typography,
  useTheme,
} from '@mui/material';
import { defaultLocale } from '@/config';
import ChatbotHistoryListItem from '@/components/atoms/ChatbotHistoryListItem/ChatbotHistoryListItem';
import { Session } from '@/lib/chatbot/queries';

type DateFormatOptions = {
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
};

const DEFAULT_DATE_FORMAT = {
  locale: defaultLocale,
  options: {
    month: 'long',
    year: 'numeric',
  },
} satisfies DateFormatOptions;

type ChatbotHistoryList = {
  sessionsList: Session[];
};

const ChatbotHistoryList = ({ sessionsList }: ChatbotHistoryList) => {
  const { palette } = useTheme();
  const uniqueDates = Array.from(
    new Set(
      sessionsList.map((session) =>
        new Intl.DateTimeFormat(
          DEFAULT_DATE_FORMAT.locale,
          DEFAULT_DATE_FORMAT.options
        ).format(new Date(session.createdAt))
      )
    )
  );

  return (
    <List>
      {dateDividerSessionsItemsInterpolation(
        uniqueDates,
        sessionsList,
        palette
      )}
    </List>
  );
};

export default ChatbotHistoryList;

function dateDividerSessionsItemsInterpolation(
  dateDividers: string[],
  sessionsList: Session[],
  palette: Palette
) {
  const items = dateDividers.map((date) => {
    const sessions = sessionsList.filter(
      (session: Session) =>
        new Intl.DateTimeFormat(
          DEFAULT_DATE_FORMAT.locale,
          DEFAULT_DATE_FORMAT.options
        ).format(new Date(session.createdAt)) === date
    );
    return sessions.map((session: Session) => session);
  });
  return items.flatMap((sameMonthItems) => (
    <>
      <ListItem>
        <Typography
          key={sameMonthItems[0].createdAt}
          color={palette.text.primary}
          fontSize='1.5rem'
          fontWeight='700'
          sx={{ padding: '1rem' }}
        >
          {capitalize(
            new Intl.DateTimeFormat(
              DEFAULT_DATE_FORMAT.locale,
              DEFAULT_DATE_FORMAT.options
            ).format(new Date(sameMonthItems[0].createdAt))
          )}
        </Typography>
      </ListItem>
      {sameMonthItems.map((item, index) => [
        <ChatbotHistoryListItem key={item.id} session={item} />,
        <>
          {sameMonthItems.length - 1 !== index && (
            <Divider component='li' sx={{ marginX: '32px' }} />
          )}
        </>,
      ])}
    </>
  ));
}
