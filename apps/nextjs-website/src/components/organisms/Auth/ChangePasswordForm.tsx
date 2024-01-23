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
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import {
  useState,
  MouseEvent,
  useCallback,
  Dispatch,
  SetStateAction,
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

  const [showPassword, setShowPassword] = useState(false);

  const [passwordConfirm, setPasswordConfirm] = useState('');

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

    onChangePassword();
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
              <FormControl variant='outlined' size='small'>
                <InputLabel htmlFor='password-input'>
                  {shared('password')}
                </InputLabel>
                <OutlinedInput
                  id='password-input'
                  required
                  type={showPassword ? 'text' : 'password'}
                  onChange={({ target: { value } }) => setPassword(value)}
                  error={!!fieldErrors.passwordError}
                  endAdornment={
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
                  }
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
                <InputLabel
                  htmlFor='confirm-password-input'
                  sx={{ top: '-8px' }}
                >
                  {shared('confirmPassword')}
                </InputLabel>
                <OutlinedInput
                  id='confirm-password-input'
                  type={showPassword ? 'text' : 'password'}
                  required
                  onChange={({ target: { value } }) =>
                    setPasswordConfirm(value)
                  }
                  endAdornment={
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
                  }
                  value={passwordConfirm}
                  label={shared('confirmPassword')}
                  error={!!fieldErrors.confirmPasswordError}
                  inputProps={{
                    sx: {
                      padding: '8.5px 14px',
                    },
                  }}
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
              <Link href='/auth/login'>{login('action')}</Link>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ChangePasswordForm;
