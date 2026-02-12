'use client';
import {
  Box,
  Divider,
  Typography,
  Link as LinkMUI,
  useTheme,
} from '@mui/material';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { useFormatter } from 'next-intl';
import Link from 'next/link';
import { useMemo } from 'react';

interface ListingItem {
  text: string;
  href?: string;
  htmlTitle?: string;
  linkColor?: string;
  isLast?: boolean;
  target?: '_self' | '_blank' | '_parent' | '_top';
}

export interface ListingsProps {
  title?: string;
  date?: {
    preDate?: string;
    date: Date;
    locale?: string;
    options: Parameters<ReturnType<typeof useFormatter>['dateTime']>[1];
  };
  name?: string;
  linksColor?: string;
  items: readonly ListingItem[];
  backgroundVariant?: 'white' | 'lightGrey';
}

const ListingItem = (props: ListingItem) => {
  const {
    text,
    htmlTitle = '',
    href,
    isLast = false,
    linkColor = 'InfoText',
    target = '_self',
  } = props;
  return (
    <Box mb={isLast ? 0 : 2}>
      {href ? (
        <LinkMUI
          component={Link}
          href={href}
          target={target}
          underline='none'
          mb={2}
          variant='body2'
          color={linkColor}
          fontWeight={600}
          title={htmlTitle}
        >
          {text}
        </LinkMUI>
      ) : (
        <Typography fontWeight={600} mb={2} variant='body2' title={htmlTitle}>
          {text}
        </Typography>
      )}
      <Divider sx={{ marginTop: '16px' }} />
    </Box>
  );
};

const Listing = ({
  title,
  date,
  name = '',
  items,
  linksColor,
  backgroundVariant = 'white',
}: ListingsProps) => {
  const theme = useTheme();
  const format = useFormatter();

  const backgroundColor = useMemo(
    () => ({
      white: theme.palette.background.paper,
      lightGrey: theme.palette.grey[50],
    }),
    [theme]
  );

  return (
    <EContainer
      py={8}
      background={backgroundColor[backgroundVariant]}
      direction='column'
    >
      {title && (
        <Typography variant='h5' mb={2}>
          {title}
        </Typography>
      )}
      {date && (
        <Typography
          color='text.secondary'
          fontSize={12}
          fontWeight={600}
          mb={5}
        >
          {`${date.preDate} ${format.dateTime(date.date, date.options)}`}
        </Typography>
      )}
      {name && (
        <Typography
          color='text.secondary'
          fontSize={14}
          fontWeight={700}
          mb={4}
          textTransform='uppercase'
        >
          {name}
        </Typography>
      )}
      {items.map((props, i) => (
        <ListingItem
          key={`${props.text}-${i}`}
          {...props}
          linkColor={linksColor}
          isLast={items.length === i + 1}
        />
      ))}
    </EContainer>
  );
};

export default Listing;
