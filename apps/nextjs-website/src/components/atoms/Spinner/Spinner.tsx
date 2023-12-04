import { CircularProgress, Stack } from '@mui/material';

interface SpinnerProps {
  size?: string | number;
  containerHeight?: string | number;
  containerPadding?: string | number;
}

const Spinner = ({
  size = 40,
  containerHeight = 500,
  containerPadding = 2,
}: SpinnerProps) => {
  return (
    <Stack
      justifyContent={'center'}
      height={containerHeight}
      padding={containerPadding}
      alignItems='center'
    >
      <CircularProgress size={size} />
    </Stack>
  );
};

export default Spinner;
