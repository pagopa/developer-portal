import { Link as MuiLink, useTheme } from "@mui/material";
import Link from "next/link";

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
    <MuiLink
      maxWidth="15rem"
      textOverflow="ellipsis"
      color={textColor}
      fontSize="1.125rem"
      fontWeight="600"
      fontFamily={typography.fontFamily}
      noWrap
      sx={{ cursor: "pointer", textDecoration: "none" }}
      component={Link}
      href={`/profile/chatbot-history/${sessionId}`}
    >
      {sessionTitle}
    </MuiLink>
  );
};

export default ChatbotHistoryNavigationLink;
