'use client';
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
import { ButtonNaked } from '@/components/atoms/ButtonNaked/ButtonNaked';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

export type ProfileDataCardItemProps = {
  id: string;
  title: string;
  value?: string;
  valueFallback?: ReactNode;
  editable: boolean;
  required: boolean;
} & (
  | { type: 'select'; values: { title: string; value: string }[] }
  | { type: 'text' }
);

export type ProfileDataCardItemEditingProps = {
  editing: boolean;
  onValue?: (value: string) => null;
  onInsertPressed: () => null;
};

export const ProfileDataCardItem = (
  infoCardItem: ProfileDataCardItemProps & ProfileDataCardItemEditingProps
) => {
  const t = useTranslations();

  if (infoCardItem.editing) {
    return (
      <Stack spacing={2} mb={2} sx={{ marginTop: '2rem' }}>
        <FormControl variant='outlined'>
          {infoCardItem.type === 'text' ? (
            infoCardItem.required ? (
              <RequiredTextField
                inputProps={{ maxlength: 100 }}
                InputProps={{
                  sx: {
                    '& input': {
                      fontWeight: 600,
                    },
                  },
                }}
                label={infoCardItem.title}
                value={infoCardItem.value ?? ''}
                onChange={({ target: { value } }) => {
                  if (infoCardItem.onValue) {
                    infoCardItem.onValue(value);
                  }
                }}
                helperText={t('shared.requiredFieldError')}
              />
            ) : (
              <TextField
                inputProps={{ maxlength: 100 }}
                InputProps={{
                  sx: {
                    '& input': {
                      fontWeight: 600,
                    },
                  },
                }}
                variant='outlined'
                id={infoCardItem.id}
                type={'text'}
                onChange={({ target: { value } }) => {
                  if (infoCardItem.onValue) {
                    infoCardItem.onValue(value);
                  }
                }}
                value={infoCardItem.value}
                label={infoCardItem.title}
                size='small'
              />
            )
          ) : (
            <>
              <InputLabel
                id={`${infoCardItem.id}-field`}
                sx={{
                  backgroundColor: 'white',
                  top: '-8px',
                  '&.Mui-focused': {
                    paddingX: '8px',
                    marginLeft: '-6px',
                    top: '0',
                  },
                }}
              >
                {infoCardItem.title}
                {infoCardItem.required ? '*' : ''}
              </InputLabel>
              <Select
                labelId={`${infoCardItem.id}-field`}
                id={`${infoCardItem.id}-field-select`}
                value={
                  infoCardItem.values.find(
                    ({ value }) => value === infoCardItem.value
                  )?.value || ''
                }
                onChange={({ target: { value } }) =>
                  infoCardItem.onValue &&
                  infoCardItem.onValue(
                    infoCardItem.values.find(({ value: v }) => v === value)
                      ?.value || ''
                  )
                }
                sx={{
                  padding: '8.5px 14px',
                  '& .MuiSelect-select': {
                    fontWeight: 600,
                  },
                }}
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
            </>
          )}
        </FormControl>
      </Stack>
    );
  }

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
          noWrap
          maxWidth={'100%'}
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
          {t('profile.insert')}
        </ButtonNaked>
      )}
    </Stack>
  );
};
