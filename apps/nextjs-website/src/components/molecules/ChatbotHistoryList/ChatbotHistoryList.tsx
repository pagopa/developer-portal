import { chatbotHeaderDateOptions } from '@/config';
import {
  capitalize,
  Divider,
  List,
  ListItem,
  Palette,
  Typography,
  useTheme,
} from '@mui/material';
import { useFormatter } from 'next-intl';
import React from 'react';
import ChatbotHistoryListItem from '@/components/atoms/ChatbotHistoryListItem/ChatbotHistoryListItem';
import { Session } from '@/lib/chatbot/queries';

type ChatbotHistoryListProps = {
  readonly sessionsList: readonly Session[];
};

const ChatbotHistoryList = ({ sessionsList }: ChatbotHistoryListProps) => {
  const { palette } = useTheme();
  const format = useFormatter();

  const formatDate = (date: string) =>
    format.dateTime(new Date(date), chatbotHeaderDateOptions);

  const uniqueDates = Array.from(
    new Set(sessionsList.map((session) => formatDate(session.createdAt)))
  );

  return (
    <List sx={{ width: '100%' }}>
      {dateDividerSessionsItemsInterpolation(
        uniqueDates,
        sessionsList,
        palette,
        format
      )}
    </List>
  );
};

export default ChatbotHistoryList;

function dateDividerSessionsItemsInterpolation(
  dateDividers: string[],
  sessionsList: readonly Session[],
  palette: Palette,
  format: ReturnType<typeof useFormatter>
) {
  const items = dateDividers.map((date) => {
    const sessions = sessionsList.filter(
      (session: Session) =>
        format.dateTime(
          new Date(session.createdAt),
          chatbotHeaderDateOptions
        ) === date
    );
    return sessions.map((session: Session) => session);
  });

  return items.flatMap((sameMonthItems) => (
    <React.Fragment key={sameMonthItems[0].createdAt}>
      <ListItem sx={{ padding: 0 }}>
        <Typography
          key={sameMonthItems[0].createdAt}
          color={palette.text.primary}
          fontSize='1.5rem'
          fontWeight='700'
          sx={{ paddingY: '1rem' }}
        >
          {capitalize(
            format.dateTime(
              new Date(sameMonthItems[0].createdAt),
              chatbotHeaderDateOptions
            )
          )}
        </Typography>
      </ListItem>
      {sameMonthItems.map((item, index) => (
        <React.Fragment key={item.id}>
          <ChatbotHistoryListItem session={item} />
          {sameMonthItems.length - 1 !== index && <Divider component='li' />}
        </React.Fragment>
      ))}
    </React.Fragment>
  ));
}
