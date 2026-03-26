import { Box, Stack, Typography, useTheme } from '@mui/material';
import { chatTimeOptions } from '@/config';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import ChatbotFeedbackButton from '@/components/atoms/ChatbotFeedbackButton/ChatbotFeedbackButton';
import CopyToClipboard from '@/components/atoms/CopyToClipboard/CopyToClipboard';
import { useTranslations, useFormatter } from 'next-intl';
import { parseChatMessage } from '@/helpers/chatMessageParser.helper';

export type Message = {
  id: string;
  text: string;
  isQuestion: boolean;
  sessionId: string;
  timestamp?: string;
  dateHeader?: string;
  hasNegativeFeedback: boolean;
  mustFillFeedbackForm: boolean;
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
  mustFillFeedbackForm,
}: ChatMessageProps) => {
  const t = useTranslations();
  const format = useFormatter();
  const { palette } = useTheme();
  const bgColor = isQuestion ? palette.grey[200] : 'transparent';
  const textColor = palette.text.primary;
  const isWelcomeMessage = !timestamp;
  const parsedChatMessage = isQuestion ? text : parseChatMessage(text);

  const timeLabel =
    timestamp && format.dateTime(new Date(timestamp), chatTimeOptions);

  const iconSize = 40;
  const marginLeftMessage = 20;

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
                useSrc={true}
                color={palette.text.secondary}
                size={40}
              />
            ) : (
              <Box>
                <IconWrapper
                  icon={'/icons/chatbotChatAvatar.svg'}
                  useSrc={true}
                  color={palette.text.secondary}
                  size={iconSize}
                />
              </Box>
            )}
          </Box>
          <Stack
            alignItems={'flex-end'}
            direction={'column'}
            width={`calc(100% - ${iconSize + marginLeftMessage}px)`}
            marginLeft='20px'
          >
            <Typography
              fontSize={'0.875rem'}
              color={textColor}
              component={'div'}
              paragraph
              width={'100%'}
              sx={{ overflowWrap: 'break-word' }}
            >
              {parsedChatMessage}
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
                  <div>
                    <CopyToClipboard
                      copiedTooltipLabel={t('chatBot.copied')}
                      textToCopy={text}
                      copyColor={palette.primary.main}
                      iconSize='20px'
                      tooltipPlacement='bottom'
                    />
                    <ChatbotFeedbackButton
                      mustFillFeedbackForm={mustFillFeedbackForm}
                      isNegativeFeedbackGiven={hasNegativeFeedback}
                      onToggleNegativeFeedback={onToggleNegativeFeedback}
                    />
                  </div>
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
