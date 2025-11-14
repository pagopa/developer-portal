import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import { PRODUCT_HEADER_HEIGHT, SITE_HEADER_HEIGHT } from '@/config';

export type ContentHeadingProps = {
  level: number;
  id?: string;
  children: ReactNode;
  skipH1?: boolean;
};

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

const asPaddingBottom = (level: number) => (level === 1 ? 3 : 1);

const asFontWeight = (level: number) => (level === 1 ? 700 : 600);

const asLineHeight = (level: number) =>
  level === 1 || level === 2 ? '2.625rem' : '1.5rem';

const scrollOffset = SITE_HEADER_HEIGHT + PRODUCT_HEADER_HEIGHT;

const createSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

const ContentHeading = ({
  level,
  id,
  children,
  skipH1 = false,
}: ContentHeadingProps) => {
  if (skipH1 && level === 1) {
    return null;
  }

  const headingId = id || createSlug(children ? children.toString() : '');

  return (
    <div
      id={headingId}
      style={{
        marginTop: `-${scrollOffset}px`,
        paddingTop: `${scrollOffset}px`,
      }}
    >
      <Typography
        variant={asVariant(level)}
        sx={{
          paddingTop: 3,
          paddingBottom: { xs: asPaddingBottom(level) },
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

export default ContentHeading;
