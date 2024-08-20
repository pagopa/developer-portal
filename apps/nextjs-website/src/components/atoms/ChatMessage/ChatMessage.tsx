import { Box, Stack, Typography, useTheme } from '@mui/material';
import { defaultLocale } from '@/config';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import ChatbotFeedbackButton from '@/components/atoms/ChatbotFeedbackButton/ChatbotFeedbackButton';

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
  timestamp?: string;
  dateHeader?: string;
  hasNegativeFeedback: boolean;
};

type ChatMessageProps = Message & {
  onToggleNegativeFeedback: (negativeFeedback: boolean) => null;
};

const ChatMessage = ({
  text,
  isQuestion,
  timestamp,
  dateHeader,
  hasNegativeFeedback,
  onToggleNegativeFeedback,
}: ChatMessageProps) => {
  const { palette } = useTheme();
  const bgColor = isQuestion ? palette.grey[200] : 'transparent';
  const textColor = palette.text.primary;
  const isWelcomeMessage = !timestamp;

  const timeLabel =
    timestamp &&
    new Intl.DateTimeFormat(
      DEFAULT_DATE_FORMAT.locale,
      DEFAULT_DATE_FORMAT.options
    ).format(new Date(timestamp));

  return (
    <Stack direction='column' width='100%' alignItems='flex-end'>
      {dateHeader && (
        <Stack
          direction='row'
          justifyContent={'center'}
          width='100%'
          marginBottom={'1rem'}
        >
          <Box
            sx={{
              borderRadius: 1,
              boxShadow:
                '0px 1px 3px 0px rgba(0, 43, 85, 0.1), 0px 1px 1px 0px rgba(0, 43, 85, 0.05), 0px 2px 1px -1px rgba(0, 43, 85, 0.1)',
              padding: '4px 8px 4px 8px',
            }}
          >
            <Typography fontSize={'0.625rem'}>{dateHeader}</Typography>
          </Box>
        </Stack>
      )}
      <Box
        bgcolor={bgColor}
        borderRadius={{ xs: '0.75rem' }}
        sx={{ width: isQuestion ? '66.6%' : '100%' }}
      >
        <Stack direction={'row'} margin={{ xs: '1rem 1rem 0.5rem 1rem' }}>
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
              fontSize={'0.875rem'}
              color={textColor}
              marginLeft={'2.2rem'}
              marginTop={1}
              paragraph
              width={'100%'}
            >
              {text}
            </Typography>
            {!isQuestion && !isWelcomeMessage && (
              <Box
                width='100%'
                height='1px'
                bgcolor={palette.action.disabled}
              />
            )}
            {!isWelcomeMessage && (
              <Stack
                direction='row'
                alignItems='flex-end'
                justifyContent={isQuestion ? 'flex-end' : 'space-between'}
                width='100%'
              >
                {!isQuestion && (
                  <ChatbotFeedbackButton
                    isNegativeFeedbackGiven={hasNegativeFeedback}
                    onToggleNegativeFeedback={onToggleNegativeFeedback}
                  />
                )}
                <Typography
                  color={textColor}
                  component={'span'}
                  marginLeft={1}
                  fontSize={'0.625rem'}
                >
                  {timeLabel}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default ChatMessage;
