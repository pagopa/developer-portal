import {
  Box,
  Stack,
  type StackProps,
  useTheme,
  type Theme,
} from '@mui/material';
import { type ReactNode } from 'react';

interface DialogBubbleProps extends StackProps {
  children: ReactNode;
}

export const DialogBubble = ({
  children,
  ...stackProps
}: DialogBubbleProps) => {
  const mui = useTheme();
  const styles = useStyles(mui);
  return (
    <Stack sx={styles.bubbleContainer} aria-haspopup='true'>
      <Box sx={styles.bubblePointer} />
      <Stack sx={styles.bubble} {...stackProps}>
        {children}
      </Stack>
    </Stack>
  );
};

const useStyles = (mui: Theme) => ({
  bubbleContainer: {
    transform: 'rotate(180deg)',
    position: 'absolute',
    backgroundColor: mui.palette.primary.main,
    marginTop: '30px',
    padding: mui.spacing(2),
    direction: 'rtl',
    textAlign: 'left',
  },
  bubblePointer: {
    display: 'block',
    position: 'absolute',
    content: '""',
    width: 0,
    height: 0,
    border: '0.9em solid transparent',
    borderTopColor: mui.palette.primary.main,
    bottom: 0,
    transform: 'translateY(1.2em)',
  },
  bubble: { transform: 'rotate(180deg)' },
});
