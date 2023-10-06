'use client';
import { Box, Skeleton, Stack } from '@mui/material';
import { FC } from 'react';

const ApiViewerLoader: FC = () => {
  return (
    <Stack
      sx={{
        minHeight: 800,
      }}
      direction='row'
    >
      <Stack
        sx={{
          width: 350,
          backgroundColor: '#EBEEF5',
          borderRightColor: '#D5DDEB',
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
        }}
        py={5}
        px={2}
        justifyContent={'start'}
      >
        <Skeleton variant='rectangular' width={'95%'} height={40} />
        <Box mt={4}>
          <Skeleton variant='rectangular' width={'70%'} height={20} />
        </Box>
        <Box mt={3}>
          {Array.from(new Array(5)).map((_, index) => (
            <Skeleton
              sx={{ marginTop: 2 }}
              key={index}
              variant='rectangular'
              width={'60%'}
              height={20}
            />
          ))}
        </Box>
      </Stack>
      <Stack
        sx={{
          width: '100%',
        }}
        my={8}
        mx={16}
        justifyContent={'start'}
      >
        <Skeleton variant='rectangular' width={'60%'} height={40} />
        <Skeleton
          sx={{ borderRadius: 25, marginTop: 2 }}
          variant='rectangular'
          width={50}
          height={20}
        />
        <Skeleton
          sx={{ marginTop: 2, maxWidth: '1500px' }}
          variant='rectangular'
          width={'100%'}
          height={350}
        />
      </Stack>
    </Stack>
  );
};

export default ApiViewerLoader;
