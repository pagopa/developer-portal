import { Button, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';

import { useTranslations } from 'next-intl';
import { emailMatcher } from '@/helpers/auth.helpers';
import RequiredTextField, {
  ValidatorFunction,
} from '@/components/molecules/RequiredTextField/RequiredTextField';

type EditEmailFormProps = {
  onSave: (email: string) => Promise<void>;
  // eslint-disable-next-line functional/no-return-void
  onCancel: () => void;
};

type FormSchema = {
  email: string;
};

const EditEmailForm = ({ onSave, onCancel }: EditEmailFormProps) => {
  const t = useTranslations('profile');

  const [errors, setErrors] = useState<Partial<FormSchema>>({});
  const [formValue, setFormValue] = useState<FormSchema>({
    email: '',
  });

  const emailValidators: ValidatorFunction[] = [
    (value: string) => ({
      valid: emailMatcher.test(value),
      error: t('changeEmail.wrongEmail'),
    }),
  ];

  const validateForm = useCallback(() => {
    const { email } = formValue;
    // eslint-disable-next-line functional/no-let
    let err = {};

    if (!emailMatcher.test(email)) {
      err = { ...err, email: t('changeEmail.wrongEmail') };
    }

    setErrors(err);
    const hasErrors = Object.keys(err).length > 0;
    return !hasErrors;
  }, [formValue, t]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;

    setFormValue(() => ({ email: value }));
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(formValue.email).catch((error) => {
      if (error.code === 'NotAuthorizedException') {
        setErrors({ email: t('changeEmail.notAuthorizedException') });
      } else {
        console.error(error);
      }
    });
  };

  const actions = (
    <>
      <>
        <Button
          color='primary'
          sx={{ paddingLeft: 0, paddingRight: 0 }}
          onClick={onCancel}
        >
          {t('changeEmail.cancel')}
        </Button>
        <Button variant='contained' color='primary' onClick={handleSave}>
          {t('changeEmail.save')}
        </Button>
      </>
    </>
  );

  return (
    <Stack gap={3}>
      <Stack
        alignItems={{ xs: 'flex-start', md: 'center' }}
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={2}
        mt={{ xs: 1, md: 3 }}
      >
        <Typography
          variant='body2'
          flexGrow={1}
          fontSize={16}
          minWidth={{ xs: 'auto', md: '170px' }}
        >
          {t('changeEmail.title')}
        </Typography>
        <Stack flexDirection='row' gap={4} display={{ xs: 'none', md: 'flex' }}>
          {actions}
        </Stack>
      </Stack>
      <RequiredTextField
        label={t('personalData.fields.email')}
        value={formValue.email}
        onChange={handleEmailChange}
        error={!!errors.email}
        helperText={errors.email || t('changeEmail.wrongEmail')}
        customValidators={emailValidators}
        InputProps={{ sx: { '& input': { fontWeight: 600 } } }}
        sx={{ marginBottom: { xs: 0, md: 3 } }}
      />
      <Stack
        flexDirection='row'
        gap={4}
        display={{ xs: 'flex', md: 'none' }}
        sx={{ marginBottom: { xs: 3, md: 0 } }}
      >
        {actions}
      </Stack>
    </Stack>
  );
};

export default EditEmailForm;
