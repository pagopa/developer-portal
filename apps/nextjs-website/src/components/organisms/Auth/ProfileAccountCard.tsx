import { type InfoCardItemProps } from '@/components/atoms/InfoCardItem/InfoCardItem';
import { Box, Card, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

export type ProfileAccountCardProps = PropsWithChildren<{
  cardTitle: string;
  items: InfoCardItemProps[];
  renderItem: (
    item: InfoCardItemProps,
    index: number,
    items: InfoCardItemProps[]
  ) => React.ReactNode;
}>;

export const ProfileAccountCard = ({
  cardTitle,
  items,
  renderItem,
}: ProfileAccountCardProps) => {
  return (
    <Card raised sx={{ padding: 4, maxWidth: '900px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h6' fontWeight={700} mt={1}>
          {cardTitle}
        </Typography>
      </Box>
      {items.map(renderItem)}
    </Card>
  );
};
