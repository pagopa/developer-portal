'use client';
import InfoCardEditButton from '@/components/atoms/InfoCardEditButton/InfoCardEditButton';
import {
  InfoCardItem,
  InfoCardItemProps,
} from '@/components/atoms/InfoCardItem/InfoCardItem';
import { isProduction } from '@/config';
import { Box, Card, Divider, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslations } from 'next-intl';

export type InfoCardProps = {
  cardTitle: string;
  items: InfoCardItemProps[];
};

export const InfoCard = ({ cardTitle, items }: InfoCardProps) => {
  const t = useTranslations('profile');
  // TODO: add onClick to edit button
  const editButton = !isProduction ? <InfoCardEditButton /> : null;
  // TODO: add onClick to add button
  const addValueComponent = !isProduction ? (
    <ButtonNaked
      color='primary'
      fontWeight={600}
      fontSize={16}
      sx={{ paddingLeft: 0, paddingRight: 0 }}
    >
      {t('personalData.addField')}
    </ButtonNaked>
  ) : null;

  return (
    <Card raised sx={{ padding: 4, maxWidth: '700px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h6' fontWeight={700} mt={1}>
          {cardTitle}
        </Typography>
        <Box display={{ xs: 'none', md: 'block' }}>{editButton}</Box>
      </Box>
      {items.map((item, index) => (
        <Box key={index}>
          <InfoCardItem {...item} valueFallback={addValueComponent} />
          {index + 1 !== items.length && <Divider />}
        </Box>
      ))}
      <Box display={{ xs: 'block', md: 'none' }}>{editButton}</Box>
    </Card>
  );
};
