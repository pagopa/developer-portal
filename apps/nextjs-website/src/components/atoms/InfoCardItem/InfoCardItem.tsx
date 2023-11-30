'use client';

import { Stack, Typography } from '@mui/material';
import { ReactNode, useCallback } from 'react';
import InfoCardEditButton from '../InfoCardEditButton/InfoCardEditButton';
import { isProduction } from '@/config';

export type InfoCardItemProps = {
  editable?: boolean;
  title: string;
  value?: string;
  valueFallback?: ReactNode;
  // eslint-disable-next-line functional/no-return-void
  onEdit?: () => void;
};

export const InfoCardItem = ({
  editable = false,
  title,
  value,
  valueFallback,
  onEdit,
}: InfoCardItemProps) => {
  const handleClick = useCallback(() => {
    if (onEdit) {
      onEdit();
    }
  }, [onEdit]);

  const showEditButton = !isProduction && editable;
  const editButton = showEditButton ? (
    <InfoCardEditButton onClick={handleClick} />
  ) : null;

  const valueComp = value ? (
    <Typography minHeight='24px' fontSize={16} flexGrow={1} fontWeight={700}>
      {value}
    </Typography>
  ) : (
    valueFallback
  );

  return (
    <Stack
      my={{ xs: 1, md: 3 }}
      flexDirection={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-start', md: 'center' }}
      gap={2}
    >
      <Typography
        variant='body2'
        fontSize={16}
        minWidth={{ xs: 'auto', md: '170px' }}
      >
        {title}
      </Typography>
      {valueComp}
      {editButton}
    </Stack>
  );
};
