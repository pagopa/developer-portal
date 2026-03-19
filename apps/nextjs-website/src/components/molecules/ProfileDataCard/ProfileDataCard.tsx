'use client';
import { ButtonNaked } from '@/components/atoms/ButtonNaked/ButtonNaked';
import InfoCardEditButton from '@/components/atoms/InfoCardEditButton/InfoCardEditButton';
import {
  ProfileDataCardItem,
  ProfileDataCardItemProps,
} from '@/components/atoms/InfoCardItem/ProfileDataCardItem';
import { isProduction } from '@/config';
import {
  validateMaxLenght,
  validateRequired,
  validateNameFormat,
} from '@/helpers/auth.helpers';
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
  const tShared = useTranslations('shared');

  const [dataSectionItems, setDataSectionItems] = useState([...items]);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      <ButtonNaked
        color='primary'
        fontWeight={600}
        fontSize={16}
        sx={{ paddingLeft: 0, paddingRight: 0 }}
        onClick={() => {
          setEditing(false);
          setErrors({});
          setDataSectionItems([...items]);
        }}
      >
        {t('personalData.cancel')}
      </ButtonNaked>
      <Button
        disabled={isButtonDisabled}
        variant='contained'
        sx={{ marginLeft: '1rem' }}
        onClick={() => {
          if (isButtonDisabled) return;

          const newErrors: Record<string, string> = {};
          dataSectionItems.forEach((item) => {
            if (
              item.id === 'name' ||
              item.id === 'surname' ||
              item.id === 'job_role'
            ) {
              const errorKey =
                validateNameFormat(item.value || '') ||
                validateMaxLenght(item.value || '') ||
                (item.id !== 'job_role' && validateRequired(item.value || ''));
              if (errorKey) {
                // eslint-disable-next-line functional/immutable-data
                newErrors[item.id] = tShared(errorKey);
              }
            }
          });

          if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
          }

          setErrors({});
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
            error={errors[item.id]}
            onValue={(value) => {
              const newItems = [...dataSectionItems];
              // eslint-disable-next-line functional/immutable-data
              newItems[index] = {
                ...newItems[index],
                value,
              };
              setDataSectionItems(newItems);

              if (
                item.id === 'name' ||
                item.id === 'surname' ||
                item.id === 'job_role'
              ) {
                const newErrors = { ...errors };
                // eslint-disable-next-line functional/immutable-data
                delete newErrors[item.id];
                setErrors(newErrors);
              }
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
