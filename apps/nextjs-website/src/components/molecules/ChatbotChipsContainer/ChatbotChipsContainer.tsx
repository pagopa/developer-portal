'use client';
import { Box } from '@mui/material';
import ChatbotChip, {
  ChatbotChipProps,
} from '@/components/atoms/ChatbotChip/ChatbotChip';

export type ChatbotChipsContainerProps = {
  chips: ChatbotChipProps[];
};

const ChatbotChipsContainer = ({ chips }: ChatbotChipsContainerProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'flex-end',
          maxWidth: '85%',
          height: 'fit-content',
          maxHeight: '160px',
          padding: '4px 4px 16px 4px',
        }}
      >
        {chips.map((chip, index) => (
          <ChatbotChip {...chip} key={`${chip.label}-${index}`} />
        ))}
      </Box>
    </Box>
  );
};

export default ChatbotChipsContainer;
