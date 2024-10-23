import Typography from '@mui/material/Typography';
import { HeadingProps } from 'gitbook-docs/markdoc/schema/heading';
import { ReactNode } from 'react';
import { SITE_HEADER_HEIGHT } from '@/components/molecules/SiteHeader/SiteHeader';
import { PRODUCT_HEADER_HEIGHT } from '@/components/atoms/ProductHeader/ProductHeader';

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

const asFontSize = (level: number) =>
  level === 1
    ? '38px'
    : level === 2
    ? '28px'
    : level === 3
    ? '18px'
    : level === 4
    ? '16px'
    : level === 5
    ? '14px'
    : '12px';

const asFontWeight = (level: number) => (level === 1 ? 700 : 600);

const asLineHeight = (level: number) =>
  level === 1 || level === 2 ? '42px' : '24px';

const scrollOffset = SITE_HEADER_HEIGHT + PRODUCT_HEADER_HEIGHT;

const Heading = ({ level, id, children }: HeadingProps<ReactNode>) => (
  <div
    id={id}
    style={{ marginTop: `-${scrollOffset}px`, paddingTop: `${scrollOffset}px` }}
  >
    <Typography
      variant={asVariant(level)}
      sx={{
        py: 3,
        fontSize: { xs: asFontSize(level) },
        fontWeight: { xs: asFontWeight(level) },
        lineHeight: { xs: asLineHeight(level) },
      }}
    >
      {children}
    </Typography>
  </div>
);

export default Heading;
