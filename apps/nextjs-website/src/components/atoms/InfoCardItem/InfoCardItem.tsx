'use client';

import {
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
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
} & (
  | { type: 'select'; values: { title: string; value: string }[] }
  | { type: 'text' }
);

type InfoCardItemEditingProps = {
  editing: boolean;
  // eslint-disable-next-line functional/no-return-void
  onValue?: (value: string) => void;
};

export const InfoCardItem = (
  infoCardItem: InfoCardItemProps & InfoCardItemEditingProps
) => {
  if (infoCardItem.editing)
    return (
      <Stack spacing={2} mb={2} sx={{ marginTop: '2rem' }}>
        <FormControl variant='outlined'>
          <InputLabel htmlFor={infoCardItem.title} sx={{ top: '-8px' }} shrink>
            {infoCardItem.title}
          </InputLabel>
          {infoCardItem.type === 'text' ? (
            <OutlinedInput
              id={infoCardItem.title}
              required
              type={'text'}
              onChange={({ target: { value } }) =>
                infoCardItem.onValue && infoCardItem.onValue(value)
              }
              value={infoCardItem.value}
              label={infoCardItem.title}
              inputProps={{
                sx: {
                  padding: '8.5px 14px',
                },
              }}
            />
          ) : (
            <Select
              labelId='company-field'
              id='company-field-select'
              value={
                infoCardItem.values.find(
                  ({ value }) => value === infoCardItem.value
                )?.value || ''
              }
              label={infoCardItem.title}
              onChange={({ target: { value } }) =>
                infoCardItem.onValue &&
                infoCardItem.onValue(
                  infoCardItem.values.find(({ value: v }) => v === value)
                    ?.value || ''
                )
              }
              sx={{ padding: '8.5px 14px' }}
              inputProps={{
                sx: {
                  padding: 0,
                },
              }}
            >
              {infoCardItem.values.map(({ title, value }) => (
                <MenuItem key={value} value={value}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          )}
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
        {infoCardItem.title}
      </Typography>
      {infoCardItem.value ? (
        <Typography
          minHeight={'24px'}
          fontSize={16}
          flexGrow={1}
          fontWeight={700}
        >
          {infoCardItem.type === 'select'
            ? infoCardItem.values.find(
                ({ value }) => value === infoCardItem.value
              )?.title
            : infoCardItem.value}
        </Typography>
      ) : (
        infoCardItem.valueFallback
      )}
    </Stack>
  );
};
