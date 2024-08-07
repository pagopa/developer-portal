import { Box, Stack, Typography, useTheme } from '@mui/material';
import { defaultLocale } from '@/config';
import IconWrapper from '../IconWrapper/IconWrapper';
import { parseMessage } from '@/helpers/chatMessageParser.helper';

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

export type Message = {
  text: string;
  isQuestion: boolean;
  timestamp: string;
};

type ChatMessageProps = Message;

const ChatMessage = ({ text, isQuestion, timestamp }: ChatMessageProps) => {
  const { palette } = useTheme();
  const bgColor = isQuestion ? palette.grey[200] : 'transparent';
  const textColor = palette.text.primary;
  const parsedMessage = parseMessage(text);

  const timeLabel = new Intl.DateTimeFormat(
    DEFAULT_DATE_FORMAT.locale,
    DEFAULT_DATE_FORMAT.options
  ).format(new Date(timestamp));

  return (
    <Box
      bgcolor={bgColor}
      borderRadius={{ xs: '0.75rem' }}
      padding={{ xs: '1rem' }}
      sx={{ width: isQuestion ? '66.6%' : '100%' }}
    >
      <Stack direction={'row'}>
        <Box marginTop={1}>
          {isQuestion ? (
            <IconWrapper
              icon={'/icons/chatbotChatUser.svg'}
              isSvg={true}
              color={palette.text.secondary}
              size={40}
            />
          ) : (
            <Box>
              <IconWrapper
                icon={'/icons/chatbotChatAvatar.svg'}
                isSvg={true}
                color={palette.text.secondary}
                size={40}
              />
            </Box>
          )}
        </Box>
        <Stack
          alignItems={'flex-end'}
          direction={'column'}
          width={'100%'}
          marginLeft={2}
        >
          <Typography
            component={'div'}
            color={textColor}
            marginLeft={'2.2rem'}
            marginTop={1}
            paragraph
            width={'100%'}
          >
            {parsedMessage}
          </Typography>
          <Typography
            color={textColor}
            component={'span'}
            marginLeft={1}
            fontSize={'0.9rem'}
          >
            {timeLabel}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatMessage;
