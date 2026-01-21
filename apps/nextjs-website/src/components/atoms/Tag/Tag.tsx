'use client';
import { Box, SxProps, Typography } from '@mui/material';

type TagProps = {
  label: string;
  backgroundColor?: string;
  sx?: SxProps;
};

const Tag = ({ label, backgroundColor = '#e9f2fc', sx }: TagProps) => {
  const baseSx: SxProps = {
    borderRadius: 1,
    maxHeight: '24px',
    flexGrow: 0,
    backgroundColor,
    maxWidth: '50%',
    textAlign: 'center',
    textOverflow: 'hidden',
    display: 'inline-block',
  };
  return (
    <Box sx={!sx ? baseSx : { ...baseSx, ...sx }}>
      <Typography fontSize={14} fontWeight={600} sx={{ marginX: '8px' }}>
        {label}
      </Typography>
    </Box>
  );
};

export default Tag;
