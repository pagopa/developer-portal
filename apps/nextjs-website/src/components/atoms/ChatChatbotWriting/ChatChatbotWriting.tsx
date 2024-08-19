import { Box, Stack, useTheme } from '@mui/material';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import styles from './ChatChatbotWriting.module.css';

export const ChatCatbotWriting = () => {
  const { palette } = useTheme();
  return (
    <Box borderRadius={{ xs: '0.75rem' }}>
      <Stack direction={'row'} margin={{ xs: '1rem 1rem 0.5rem 1rem' }}>
        <IconWrapper
          icon={'/icons/chatbotChatAvatar.svg'}
          isSvg={true}
          color={palette.text.secondary}
          size={40}
        />
        <Box className={styles.dotContainer} marginLeft={2}>
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className={styles.dot}
              style={{ backgroundColor: palette.text.primary }}
            />
          ))}
        </Box>
      </Stack>
    </Box>
  );
};
