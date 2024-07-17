import { Box, Stack, Typography, useTheme } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AdbOutlinedIcon from '@mui/icons-material/AdbOutlined';
import { defaultLocale } from '@/config';

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
  const bgColor = isQuestion
    ? palette.background.paper
    : `${palette.info.light}80`;
  const textColor = palette.text.primary;

  const timeLabel = new Intl.DateTimeFormat(
    DEFAULT_DATE_FORMAT.locale,
    DEFAULT_DATE_FORMAT.options
  ).format(new Date(timestamp));

  return (
    <Box
      bgcolor={bgColor}
      borderRadius={{ xs: '0.75rem' }}
      padding={{ xs: '1rem' }}
      sx={{ width: '66.6%' }}
    >
      <Stack alignItems={'center'} direction={'row'}>
        {isQuestion ? <PersonOutlineIcon /> : <AdbOutlinedIcon />}
        <Typography color={textColor} component={'span'} marginLeft={1}>
          {timeLabel}
        </Typography>
      </Stack>
      <Typography
        color={textColor}
        marginLeft={'2.2rem'}
        marginTop={'1rem'}
        paragraph
      >
        {text}
      </Typography>
    </Box>
  );
};

export default ChatMessage;
