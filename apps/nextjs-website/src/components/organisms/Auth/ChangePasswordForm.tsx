'use client';
import { IllusDataSecurity } from '@pagopa/mui-italia';
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { validatePassword } from '@/helpers/auth.helpers';
import { useTranslations } from 'next-intl';

interface ChangePasswordFormProps {
  onChangePassword: () => Promise<void>;
  setPassword: Dispatch<SetStateAction<string>>;
  password: string;
}

interface ChangePasswordFieldsError {
  passwordError: boolean | null;
  confirmPasswordError: string | null;
}

const ChangePasswordForm = ({
  onChangePassword,
  setPassword,
  password,
}: ChangePasswordFormProps) => {
  const login = useTranslations('auth.login');
  const resetPassword = useTranslations('auth.resetPassword');
  const signUp = useTranslations('auth.signUp');
  const shared = useTranslations('shared');

  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [passwordConfirm, setPasswordConfirm] = useState('');

  const { palette } = useTheme();

  const [fieldErrors, setFieldErrors] = useState<ChangePasswordFieldsError>({
    passwordError: null,
    confirmPasswordError: null,
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseDownConfirmPassword = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const validateForm = useCallback(() => {
    const passwordError = validatePassword(password);
    const confirmPasswordHasErrors = password !== passwordConfirm;

    setFieldErrors({
      passwordError: passwordError ? true : null,
      confirmPasswordError: confirmPasswordHasErrors
        ? signUp('passwordMismatchError')
        : null,
    });

    return !passwordError && !confirmPasswordHasErrors;
  }, [password, passwordConfirm, signUp]);

  const onChangePasswordClick = useCallback(() => {
    const valid = validateForm();

    if (!valid) {
      return;
    }

    setSubmitting(true);

    onChangePassword().finally(() => {
      setSubmitting(false);
    });
  }, [onChangePassword, validateForm]);

  return (
    <Box
      component='section'
      sx={{
        width: '90vw',
        '@media (min-width: 1200px)': {
          width: '35vw',
        },
      }}
    >
      <Card variant='elevation' elevation={8}>
        <Grid container justifyContent='center'>
          <Grid item xs={10}>
            <Stack pt={4} display='flex' alignItems='center'>
              <IllusDataSecurity />
            </Stack>
            <Typography variant='h4' pt={8} mb={4} textAlign='center'>
              {resetPassword('newPassword')}
            </Typography>
            <Stack spacing={2} mb={2}>
              <FormControl
                variant='outlined'
                size='small'
                sx={{
                  '& div.MuiFormControl-root:has(>label) + p': {
                    display: 'none',
                  },
                  '& div.MuiFormControl-root:has(>label) + p.Mui-error': {
                    display: 'block',
                  },
                  '& div.MuiFormControl-root:has(>label.Mui-focused) + p': {
                    display: 'block',
                  },
                }}
              >
                <TextField
                  id='password-input'
                  required
                  type={showPassword ? 'text' : 'password'}
                  onChange={({ target: { value } }) => setPassword(value)}
                  variant='outlined'
                  size='small'
                  error={!!fieldErrors.passwordError}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge='end'
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  value={password}
                  label={shared('password')}
                />
                <FormHelperText error={!!fieldErrors.passwordError}>
                  {signUp('passwordPolicy')}
                </FormHelperText>
              </FormControl>
            </Stack>
            <Stack spacing={2} mb={2}>
              <FormControl variant='outlined'>
                <TextField
                  id='confirm-password-input'
                  type={showPassword ? 'text' : 'password'}
                  required
                  onChange={({ target: { value } }) =>
                    setPasswordConfirm(value)
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle confirm password visibility'
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownConfirmPassword}
                          edge='end'
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  value={passwordConfirm}
                  label={shared('confirmPassword')}
                  error={!!fieldErrors.confirmPasswordError}
                  size='small'
                />
                {fieldErrors.confirmPasswordError && (
                  <FormHelperText error>
                    {signUp('passwordMismatchError')}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
            <Stack spacing={4} pt={4} pb={2}>
              <Stack direction='row' justifyContent='center'>
                <Button
                  variant='contained'
                  onClick={() => {
                    onChangePasswordClick();
                  }}
                  disabled={submitting}
                >
                  {resetPassword('send')}
                </Button>
              </Stack>
            </Stack>
            <Divider />
            <Stack
              pt={4}
              pb={8}
              display='flex'
              alignItems='center'
              justifyContent='center'
              flexDirection='row'
            >
              <Typography variant='caption-semibold' mr={1}>
                {resetPassword('rememberPassword')}
              </Typography>
              <Typography
                component={Link}
                fontSize={16}
                href='/auth/login'
                variant='caption-semibold'
                color={palette.primary.main}
              >
                {login('action')}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ChangePasswordForm;
