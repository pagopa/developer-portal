'use client';
import InfoCardEditButton from '@/components/atoms/InfoCardEditButton/InfoCardEditButton';
import {
  InfoCardItemProfile,
  InfoCardItemProfileProps,
} from '@/components/atoms/InfoCardItem/InfoCardItemProfile';
import { isProduction } from '@/config';
import { Box, Button, Card, Divider, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export type InfoCardProfileProps = {
  cardTitle: string;
  items: InfoCardItemProfileProps[];
  onValue?: (items: InfoCardItemProfileProps[]) => null;
};

export const InfoCardProfile = ({
  cardTitle,
  items,
  onValue,
}: InfoCardProfileProps) => {
  const t = useTranslations('profile');

  const [dataSectionItems, setDataSectionItems] = useState([...items]);
  useEffect(() => {
    setDataSectionItems([...items]);
  }, [items]);

  const [editing, setEditing] = useState(false);
  // if at least one item is editable, show the edit button
  const editButton = !editing ? (
    <InfoCardEditButton
      onClick={() => {
        setEditing(true);
        return null;
      }}
    />
  ) : (
    <Stack sx={{ display: 'flex', flexDirection: 'row' }}>
      <ButtonNaked
        color='primary'
        fontWeight={600}
        fontSize={16}
        sx={{ paddingLeft: 0, paddingRight: 0 }}
        onClick={() => {
          setEditing(false);
          setDataSectionItems([...items]);
        }}
      >
        {t('personalData.cancel')}
      </ButtonNaked>
      <Button
        variant='contained'
        sx={{ marginLeft: '1rem' }}
        onClick={() => {
          setEditing(false);
          onValue && onValue(dataSectionItems);
        }}
      >
        {t('personalData.save')}
      </Button>
    </Stack>
  );

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
      {dataSectionItems.map((item, index) => (
        <Box key={index}>
          <InfoCardItemProfile
            {...item}
            valueFallback={addValueComponent}
            editing={editing}
            onValue={(value) => {
              const newItems = [...dataSectionItems];
              // eslint-disable-next-line functional/immutable-data
              newItems[index] = {
                ...newItems[index],
                // workaround for cognito not accepting empty strings
                value: value == '' ? ' ' : value,
              };
              setDataSectionItems(newItems);
              return null;
            }}
            onInsertPressed={() => {
              setEditing(true);
              return null;
            }}
          />
          {index + 1 !== items.length && !editing && <Divider />}
        </Box>
      ))}
      <Box display={{ xs: 'block', md: 'none' }}>{editButton}</Box>
    </Card>
  );
};
