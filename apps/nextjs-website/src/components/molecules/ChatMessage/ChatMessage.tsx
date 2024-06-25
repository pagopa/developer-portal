import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AdbOutlinedIcon from '@mui/icons-material/AdbOutlined';

type ChatMessageProps = {
  message: string;
  sender?: string;
  timestamp: string;
};

const ChatMessage = ({ message, sender, timestamp }: ChatMessageProps) => {
  const { palette } = useTheme();
  const bgColor = palette.background.paper;
  const titleColor = palette.text.primary;
  const textColor = palette.text.primary;
  return (
    <Box
      bgcolor={bgColor}
      borderRadius={{ xs: '0.75rem' }}
      margin={{ xs: '0.5rem' }}
      padding={{ xs: '1.5rem' }}
      sx={{ flexGrow: 1 }}
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
            color={titleColor}
            component={'span'}
          >
            {sender}
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
