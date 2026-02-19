import { Box } from '@mui/material';
import ChatbotChip, {
  ChatbotChipProps,
} from '@/components/atoms/ChatbotChip/ChatbotChip';

type ChatbotChipsContainerProps = {
  chips: ChatbotChipProps[];
};

const ChatbotChipsContainer = ({ chips }: ChatbotChipsContainerProps) => {
  return (
    <Box>
      {chips.map((chip, index) => (
        <ChatbotChip label={chip.label} key={index} />
      ))}
    </Box>
  );
};

export default ChatbotChipsContainer;
