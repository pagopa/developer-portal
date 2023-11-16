'use client';
import InfoCardEditButton from '@/components/atoms/InfoCardEditButton/InfoCardEditButton';
import {
  InfoCardItem,
  InfoCardItemProps,
} from '@/components/atoms/InfoCardItem/InfoCardItem';
import { Box, Card, Divider, Typography } from '@mui/material';

export type InfoCardProps = {
  cardTitle: string;
  items: InfoCardItemProps[];
};

export const InfoCard = ({ cardTitle, items }: InfoCardProps) => {
  const editButton = <InfoCardEditButton />;
  return (
    <Card raised sx={{ padding: 4, maxWidth: '700px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h6' mt={1}>
          {cardTitle}
        </Typography>
        <Box display={{ xs: 'none', md: 'block' }}>{editButton}</Box>
      </Box>
      {items.map((item, index) => (
        <Box key={index}>
          <InfoCardItem {...item} />
          {index + 1 !== items.length && <Divider />}
        </Box>
      ))}
      <Box display={{ xs: 'block', md: 'none' }}>{editButton}</Box>
    </Card>
  );
};
