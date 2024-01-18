'use client';
import { translations } from '@/_contents/translations';
import RequiredTextField from '@/components/molecules/RequiredTextField/RequiredTextField';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

export type InfoCardItemProfileProps = {
  title: string;
  value?: string;
  valueFallback?: ReactNode;
  editable: boolean;
  required: boolean;
} & (
  | { type: 'select'; values: { title: string; value: string }[] }
  | { type: 'text' }
);

export type InfoCardItemEditingProfileProps = {
  editing: boolean;
  onValue?: (value: string) => null;
  onInsertPressed: () => null;
};

export const InfoCardItemProfile = (
  infoCardItem: InfoCardItemProfileProps & InfoCardItemEditingProfileProps
) => {
  const t = useTranslations('profile');

  if (infoCardItem.editing)
    return (
      <Stack spacing={2} mb={2} sx={{ marginTop: '2rem' }}>
        <FormControl variant='outlined'>
          {infoCardItem.type !== 'text' ||
            (!infoCardItem.required && (
              <InputLabel
                htmlFor={infoCardItem.title}
                sx={{ top: '-8px' }}
                shrink
              >
                {infoCardItem.title}
                {infoCardItem.required ? '*' : ''}
              </InputLabel>
            ))}

          {infoCardItem.type === 'text' ? (
            infoCardItem.required ? (
              <RequiredTextField
                label={infoCardItem.title}
                value={infoCardItem.value ?? ''}
                onChange={({ target: { value } }) => {
                  infoCardItem.onValue && infoCardItem.onValue(value);
                }}
                helperText={translations.shared.requiredFieldError}
              />
            ) : (
              <OutlinedInput
                id={infoCardItem.title}
                type={'text'}
                onChange={({ target: { value } }) => {
                  infoCardItem.onValue && infoCardItem.onValue(value);
                }}
                value={infoCardItem.value}
                label={infoCardItem.title}
                inputProps={{
                  sx: {
                    padding: '8.5px 14px',
                  },
                }}
              />
            )
          ) : (
            <Select
              labelId='company-field'
              id='company-field-select'
              value={
                infoCardItem.values.find(
                  ({ value }) => value === infoCardItem.value
                )?.value || ''
              }
              label={infoCardItem.title + infoCardItem.required ? '*' : ''}
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
        {infoCardItem.title}
      </Typography>
      {infoCardItem.value && infoCardItem.value != '' ? (
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
        <ButtonNaked
          onClick={infoCardItem.onInsertPressed}
          color='primary'
          sx={{ paddingLeft: 0, paddingRight: 0 }}
        >
          {t('insert')}
        </ButtonNaked>
      )}
    </Stack>
  );
};
