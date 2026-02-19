import { Box } from '@mui/material';
import ChatbotChip, {
  ChatbotChipProps,
} from '@/components/atoms/ChatbotChip/ChatbotChip';

type ChatbotChipsContainerProps = {
  chips: ChatbotChipProps[];
};

const ChatbotChipsContainer = ({ chips }: ChatbotChipsContainerProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'flex-end',
        maxWidth: '100%',
        height: 'fit-content',
        maxHeight: '160px',
        p: '4px',
      }}
    >
      {chips.map((chip, index) => (
        <ChatbotChip label={chip.label} key={index} />
      ))}
    </Box>
  );
};

export default ChatbotChipsContainer;
