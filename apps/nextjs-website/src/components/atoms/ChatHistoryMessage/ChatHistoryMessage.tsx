import { Stack, Typography, useTheme } from '@mui/material';
import { defaultLocale } from '@/config';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import { parseChatMessage } from '@/helpers/chatMessageParser.helper';

type DateFormatOptions = {
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
};

const DEFAULT_DATE_FORMAT = {
  locale: defaultLocale,
  options: {
    timeStyle: 'short',
    hourCycle: 'h23',
  },
} satisfies DateFormatOptions;

type ChatMessageProps = {
  text: string;
  sender: string;
  isQuestion: boolean;
  timestamp?: string;
};

const ChatHistoryMessage = ({
  text,
  timestamp,
  isQuestion,
  sender,
}: ChatMessageProps) => {
  const { palette } = useTheme();
  const textColor = palette.text.primary;
  const parsedChatMessage = isQuestion ? text : parseChatMessage(text);
  const iconSize = 28;

  const timeLabel =
    timestamp &&
    new Intl.DateTimeFormat(
      DEFAULT_DATE_FORMAT.locale,
      DEFAULT_DATE_FORMAT.options
    ).format(new Date(timestamp));

  return (
    <Stack direction='column' width='100%' spacing={1}>
      <Stack
        direction={'row'}
        margin={{ xs: '1rem 1rem 0.5rem 1rem' }}
        alignItems='center'
        spacing={1}
      >
        {isQuestion ? (
          <IconWrapper
            icon={'/icons/chatbotChatUserBorder.svg'}
            useSrc={true}
            color={palette.text.secondary}
            size={iconSize}
            sx={{ overflow: 'visible' }}
          />
        ) : (
          <IconWrapper
            icon={'/icons/chatbotChatAvatar.svg'}
            useSrc={true}
            color={palette.text.secondary}
            size={iconSize}
            sx={{ overflow: 'visible' }}
          />
        )}
        <Typography
          color={textColor}
          component='span'
          minWidth='12rem'
          fontWeight={600}
          sx={{
            fontSize: { xs: '1rem', xl: '1.125rem' },
            overflowWrap: 'break-word',
          }}
        >
          {sender}
        </Typography>
        {timeLabel && (
          <Typography
            color={textColor}
            component={'span'}
            marginLeft={1}
            sx={{ fontSize: { xs: '0.75rem', xl: '0.875rem' } }}
          >
            {timeLabel}
          </Typography>
        )}
      </Stack>
      <Typography
        color={textColor}
        component={'div'}
        marginLeft={'1rem'}
        paragraph
        width={'100%'}
        sx={{
          fontSize: { xs: '0.875rem', xl: '1rem' },
          overflowWrap: 'break-word',
        }}
      >
        {parsedChatMessage}
      </Typography>
    </Stack>
  );
};

export default ChatHistoryMessage;
