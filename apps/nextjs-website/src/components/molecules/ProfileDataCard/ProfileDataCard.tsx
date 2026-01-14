'use client';
import InfoCardEditButton from '@/components/atoms/InfoCardEditButton/InfoCardEditButton';
import {
  ProfileDataCardItem,
  ProfileDataCardItemProps,
} from '@/components/atoms/InfoCardItem/ProfileDataCardItem';
import { isProduction } from '@/config';
import { Box, Button, Card, Divider, Stack, Typography } from '@mui/material';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export type ProfileDataCardProps = {
  cardTitle: string;
  items: ProfileDataCardItemProps[];
  onValue?: (items: ProfileDataCardItemProps[]) => null;
};

export const ProfileDataCard = ({
  cardTitle,
  items,
  onValue,
}: ProfileDataCardProps) => {
  const t = useTranslations('profile');

  const [dataSectionItems, setDataSectionItems] = useState([...items]);
  useEffect(() => {
    setDataSectionItems([...items]);
  }, [items]);

  const isButtonDisabled = dataSectionItems.some(
    (item) => item.required && (!item.value || item.value.trim() === '')
  );

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
      <Button
        color='primary'
        sx={{ paddingLeft: 0, paddingRight: 0, fontWeight: 600, fontSize: 16 }}
        onClick={() => {
          setEditing(false);
          setDataSectionItems([...items]);
        }}
      >
        {t('personalData.cancel')}
      </Button>
      <Button
        disabled={isButtonDisabled}
        variant='contained'
        sx={{ marginLeft: '1rem' }}
        onClick={() => {
          if (isButtonDisabled) return;
          setEditing(false);
          if (onValue) {
            onValue(dataSectionItems);
          }
        }}
      >
        {t('personalData.save')}
      </Button>
    </Stack>
  );

  const addValueComponent = !isProduction ? (
    <Button
      color='primary'
      sx={{ paddingLeft: 0, paddingRight: 0, fontWeight: 600, fontSize: 16 }}
    >
      {t('personalData.addField')}
    </Button>
  ) : null;

  return (
    <Card raised sx={{ padding: 4, maxWidth: '900px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h6' fontWeight={700} mt={1}>
          {cardTitle}
        </Typography>
        <Box display={{ xs: 'none', md: 'block' }}>{editButton}</Box>
      </Box>
      {dataSectionItems.map((item, index) => (
        <Box key={index}>
          <ProfileDataCardItem
            {...item}
            valueFallback={addValueComponent}
            editing={editing}
            onValue={(value) => {
              const newItems = [...dataSectionItems];
              // eslint-disable-next-line functional/immutable-data
              newItems[index] = {
                ...newItems[index],
                value,
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
