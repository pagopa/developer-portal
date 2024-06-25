'use client';
import Fab from '@mui/material/Fab';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import { Badge, Box, useTheme } from '@mui/material';

type ChatButtonProps = {
  disabled?: boolean;
  label: string;
  onOpenChat: () => null;
};

const ChatButton = ({
  disabled = false,
  label,
  onOpenChat,
}: ChatButtonProps) => {
  const { palette } = useTheme();
  return (
    <Badge
      badgeContent={1}
      color='success'
      overlap='circular'
      variant='dot'
      sx={{
        '& .MuiBadge-badge': {
          fontSize: 9,
          height: 15,
          minWidth: 15,
          borderRadius: 20,
          zIndex: 1051,
        },
      }}
    >
      <Box bgcolor={'black'} borderRadius={100} padding={'3px'}>
        <Fab
          disabled={disabled}
          aria-label={label}
          color={'primary'}
          onClick={onOpenChat}
        >
          <QuestionAnswerOutlinedIcon />
        </Fab>
      </Box>
    </Badge>
  );
};

export default ChatButton;
