import { Link, useTheme } from '@mui/material';

type ChatbotHistoryNavigationLinkProps = {
  sessionId: string;
  sessionTitle: string;
};

const ChatbotHistoryNavigationLink = ({
  sessionId,
  sessionTitle,
}: ChatbotHistoryNavigationLinkProps) => {
  const { palette, typography } = useTheme();
  const textColor = palette.text.secondary;

  return (
    <Link
      maxWidth='15rem'
      textOverflow='ellipsis'
      color={textColor}
      fontSize='1.125rem'
      fontWeight='600'
      fontFamily={typography.fontFamily}
      component='span'
      noWrap
      sx={{ cursor: 'pointer', textDecoration: 'none' }}
      onClick={() => {
        // TODO: Implement the navigation to the chatbot history session
        console.log(`Navigating to chatbot history session: ${sessionId}`);
      }}
    >
      {sessionTitle}
    </Link>
  );
};

export default ChatbotHistoryNavigationLink;
