import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import { removeEmojis } from '../helpers';
import { Box } from '@mui/material';

type SummaryHeadingProps = {
  level: number;
  children: ReactNode;
};

const SummaryHeading = ({ level, children }: SummaryHeadingProps) => {
  if (level === 1) {
    return;
  }
  return (
    <Box sx={{ padding: '16px 0 0 32px' }}>
      <Typography color={'#828282'} fontSize={14} fontWeight={700}>
        {typeof children === 'string' ? removeEmojis(children) : children}
      </Typography>
    </Box>
  );
};

export default SummaryHeading;
