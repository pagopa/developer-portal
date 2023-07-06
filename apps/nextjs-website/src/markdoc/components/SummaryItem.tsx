import { ReactNode } from 'react';
import Typography from '@mui/material/Typography';

type SummaryItemProps = {
  children: ReactNode;
};

const SummaryItem = ({ children }: SummaryItemProps) => {
  return (
    <Typography
      variant={'body2'}
      component={'div'}
      sx={{
        margin: 0,
        padding: 0,
      }}
    >
      {children}
    </Typography>
  );
};

export default SummaryItem;
