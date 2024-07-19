import { alpha, Box, Stack, Typography, useTheme } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AdbOutlinedIcon from '@mui/icons-material/AdbOutlined';

type ChatMessageProps = {
  message: string;
  sender?: string;
  timestamp: string;
};

const ChatMessage = ({ message, sender, timestamp }: ChatMessageProps) => {
  const { palette } = useTheme();
  const bgColor = sender
    ? palette.background.paper
    : alpha(palette.info.light, 0.5);
  const textColor = palette.text.primary;
  const senderLabel = sender || 'AI ChatBot'; // TO-BE-REMOVED: This line will be remove in the next iteration of the component - the translation is not needed here
  return (
    <Box
      bgcolor={bgColor}
      borderRadius={{ xs: '0.75rem' }}
      padding={{ xs: '1rem' }}
      sx={{ width: '66.6%' }}
    >
      <Stack
        justifyContent={'space-between'}
        alignItems={'center'}
        direction={'row'}
      >
        <Stack alignItems={'center'} direction={'row'}>
          {sender ? <PersonOutlineIcon /> : <AdbOutlinedIcon />}
          <Typography
            marginLeft={'0.5rem'}
            fontWeight={600}
            color={palette.text.primary}
            component={'span'}
          >
            {senderLabel}
          </Typography>
        </Stack>
        <Typography color={textColor} component={'span'}>
          {timestamp}
        </Typography>
      </Stack>
      <Typography
        color={textColor}
        marginLeft={'2.2rem'}
        marginTop={'1rem'}
        paragraph
      >
        {message}
      </Typography>
    </Box>
  );
};

export default ChatMessage;
