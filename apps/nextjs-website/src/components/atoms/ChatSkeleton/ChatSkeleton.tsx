import { Skeleton, Stack } from '@mui/material';

export const ChatSkeleton = () => {
  return (
    <Stack
      direction={'column'}
      marginTop={'0.75rem'}
      gap={'0.75rem'}
      height={'100%'}
      minHeight={'20rem'}
      alignItems={'flex-end'}
    >
      <Stack direction={'row'} width={'100%'} justifyContent={'center'}>
        <Skeleton variant='rounded' width={'2.25rem'} height={'1.438rem'} />
      </Stack>
      <Skeleton variant='rounded' width={'100%'} height={'40%'} />
      <Skeleton variant='rounded' width={'60%'} height={'25%'} />
    </Stack>
  );
};
