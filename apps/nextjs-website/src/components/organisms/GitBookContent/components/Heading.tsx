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
      return 'h3';
    case 4:
      return 'h4';
    case 5:
      return 'h5';
    default:
      return 'h6';
  }
};

const asFontSize = (level: number) =>
  level === 1
    ? '2.375rem'
    : level === 2
    ? '1.875rem'
    : level === 3
    ? '1.5rem'
    : level === 4
    ? '1.25rem'
    : level === 5
    ? '1rem'
    : '0.75rem';

const asFontWeight = (level: number) => (level === 1 ? 700 : 600);

const asLineHeight = (level: number) =>
  level === 1 || level === 2 ? '2.625rem' : '1.5rem';

const scrollOffset = SITE_HEADER_HEIGHT + PRODUCT_HEADER_HEIGHT;

export const SubHeading = ({
  level,
  id,
  children,
}: HeadingProps<ReactNode>) => {
  const createSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

  if (level === 1) {
    return null;
  }

  return (
    <div
      id={createSlug(children ? children.toString() : id)}
      style={{
        marginTop: `-${scrollOffset}px`,
        paddingTop: `${scrollOffset}px`,
      }}
    >
      <Typography
        variant={asVariant(level)}
        sx={{
          paddingTop: 3,
          paddingBottom: 1,
          fontSize: { xs: asFontSize(level) },
          fontWeight: { xs: asFontWeight(level) },
          lineHeight: { xs: asLineHeight(level) },
        }}
      >
        {children}
      </Typography>
    </div>
  );
};

const Heading = ({ level, id, children }: HeadingProps<ReactNode>) => (
  <div
    id={id}
    style={{ marginTop: `-${scrollOffset}px`, paddingTop: `${scrollOffset}px` }}
  >
    <Typography
      variant={asVariant(level)}
      sx={{
        paddingTop: 3,
        paddingBottom: 1,
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
