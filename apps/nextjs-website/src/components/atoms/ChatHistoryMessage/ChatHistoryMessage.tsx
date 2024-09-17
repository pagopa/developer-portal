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
  const parsedChatMessage = parseChatMessage(text);
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
          />
        ) : (
          <IconWrapper
            icon={'/icons/chatbotChatAvatar.svg'}
            useSrc={true}
            color={palette.text.secondary}
            size={iconSize}
          />
        )}
        <Typography
          fontSize='1rem'
          color={textColor}
          component='span'
          minWidth='12rem'
          fontWeight={600}
        >
          {sender}
        </Typography>
        {timeLabel && (
          <Typography
            color={textColor}
            component={'span'}
            marginLeft={1}
            fontSize={'0.625rem'}
          >
            {timeLabel}
          </Typography>
        )}
      </Stack>
      <Typography
        fontSize={'0.875rem'}
        color={textColor}
        component={'div'}
        marginLeft={'1rem'}
        paragraph
        width={'100%'}
      >
        {parsedChatMessage}
      </Typography>
    </Stack>
  );
};

export default ChatHistoryMessage;
