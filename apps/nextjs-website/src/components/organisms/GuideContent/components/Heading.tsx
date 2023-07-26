import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

type HeadingProps = {
  level: number;
  children: ReactNode;
};

const asVariant = (level: number) => {
  switch (level) {
    case 1:
      return 'h1';
    case 2:
      return 'h2';
    case 3:
      return 'h4';
    case 4:
      return 'h5';
    default:
      return 'h6';
  }
};

const Heading = ({ level, children }: HeadingProps) => (
  <Typography variant={asVariant(level)}>{children}</Typography>
);

export default Heading;
