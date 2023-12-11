'use client';

import {
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';
import InfoCardEditButton from '../InfoCardEditButton/InfoCardEditButton';

export type InfoCardItemProps = {
  title: string;
  value?: string;
  valueFallback?: ReactNode;
  editable: boolean;
};

type InfoCardItemEditingProps = {
  editing: boolean;
  // eslint-disable-next-line functional/no-return-void
  onValue?: (value: string) => void;
};

export const InfoCardItem = ({
  title,
  value,
  valueFallback,
  editing,
  onValue,
}: InfoCardItemProps & InfoCardItemEditingProps) => {
  if (editing)
    return (
      <Stack spacing={2} mb={2} sx={{ marginTop: '2rem' }}>
        <FormControl variant='outlined'>
          <InputLabel htmlFor={title} sx={{ top: '-8px' }} shrink>
            {title}
          </InputLabel>
          <OutlinedInput
            id={title}
            required
            type={'text'}
            onChange={({ target: { value } }) => onValue && onValue(value)}
            value={value}
            label={title}
            inputProps={{
              sx: {
                padding: '8.5px 14px',
              },
            }}
          />
        </FormControl>
      </Stack>
    );

  return (
    <Stack my={{ xs: 1, md: 3 }} flexDirection={{ xs: 'column', md: 'row' }}>
      <Typography
        variant='body2'
        fontSize={16}
        minWidth={{ xs: 'auto', md: '200px' }}
      >
        {title}
      </Typography>
      {value ? (
        <Typography
          minHeight={'24px'}
          fontSize={16}
          flexGrow={1}
          fontWeight={700}
        >
          {value}
        </Typography>
      ) : (
        valueFallback
      )}
    </Stack>
  );
};
