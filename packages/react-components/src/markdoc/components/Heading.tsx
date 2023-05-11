import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

type HeadingProps = {
  level: number;
  children: ReactNode;
};

const asVariant = (level: number) =>
  level === 1
    ? 'h1'
    : level === 2
    ? 'h2'
    : level === 3
    ? 'h3'
    : level === 4
    ? 'h4'
    : level === 5
    ? 'h5'
    : 'h6';

const Heading = ({ level, children }: HeadingProps) => (
  <Typography variant={asVariant(level)}>{children}</Typography>
);

export default Heading;
