'use client';
import { LoginFunction } from '@/lib/types/loginFunction';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Typography,
  Stack,
  Checkbox,
  Grid,
  Divider,
  Button,
  Card,
  FormControlLabel,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
  FormHelperText,
} from '@mui/material';
import { IllusLogin } from '@pagopa/mui-italia';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { snackbarAutoHideDurationMs } from '@/config';
import { emailMatcher } from '@/helpers/auth.helpers';
import RequiredTextField, {
  ValidatorFunction,
} from '@/components/molecules/RequiredTextField/RequiredTextField';

interface LoginFormProps {
  onLogin: LoginFunction;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const signUp = useTranslations('auth.signUp');
  const login = useTranslations('auth.login');
  const shared = useTranslations('shared');

  const { palette } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState<boolean>(false);
  const [isPasswordDirty, setIsPasswordDirty] = useState<boolean>(false);

  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === 'authenticated') {
    redirect('/');
  }

  const handleClickShowPassword = useCallback(
    () => setShowPassword((show) => !show),
    []
  );

  const handleMouseDownPassword = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
    []
  );

  const onLoginHandler = useCallback(() => {
    setSubmitting(true);
    onLogin({ username, password })
      .catch((e) => setError(e.message))
      .finally(() => {
        setSubmitting(false);
      });
  }, [onLogin, username, password]);

  const emailValidators: ValidatorFunction[] = [
    (value: string) => ({
      valid: emailMatcher.test(value),
      error: shared('emailFieldError'),
    }),
  ];

  const validateForm = useCallback(() => {
    const areFieldsValid = [username, password].every(
      (value) => value && value.trim().length > 0
    );

    if (isPasswordDirty && password.length == 0) {
      setIsPasswordEmpty(true);
    } else {
      setIsPasswordEmpty(false);
    }

    setIsFormValid(areFieldsValid);
  }, [username, password, isPasswordDirty]);

  useEffect(() => {
    validateForm();
  }, [validateForm, username, password]);

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
      <Card variant='elevation' elevation={8} sx={{ borderRadius: '16px' }}>
        <Grid container justifyContent='center'>
          <Grid item xs={10}>
            <form>
              <Stack pt={4} display='flex' alignItems='center'>
                <IllusLogin />
              </Stack>
              <Typography variant='h4' pt={8} mb={4} textAlign='center'>
                {login('loginToYourAccount')}
              </Typography>
              <Stack spacing={2} mb={4}>
                <RequiredTextField
                  label={shared('emailAddress')}
                  variant='outlined'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  helperText={shared('emailFieldError')}
                  customValidators={emailValidators}
                />
              </Stack>
              <Stack spacing={2} mb={2}>
                <FormControl variant='outlined'>
                  <InputLabel htmlFor='password-input' sx={{ top: '-8px' }}>
                    {shared('password')}
                  </InputLabel>
                  <OutlinedInput
                    id='password-input'
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
                    error={isPasswordEmpty}
                    onBlur={() => setIsPasswordDirty(true)}
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
                    label={shared('password')}
                    inputProps={{
                      sx: {
                        padding: '8.5px 14px',
                      },
                    }}
                  />
                  <FormHelperText
                    sx={{ display: !isPasswordEmpty ? 'none' : 'block' }}
                    error={isPasswordEmpty}
                  >
                    {shared('requiredFieldError')}
                  </FormHelperText>
                </FormControl>
              </Stack>
              <Grid container mb={1}>
                <FormControlLabel
                  control={<Checkbox />}
                  label={login('rememberMe')}
                />
              </Grid>
              <Stack spacing={4} pt={4} pb={5}>
                <Stack direction='row' justifyContent='center'>
                  <Button
                    disabled={submitting || !isFormValid}
                    variant='contained'
                    onClick={onLoginHandler}
                  >
                    {login('action')}
                  </Button>
                </Stack>
              </Stack>
              <Box
                pt={4}
                pb={3}
                display='flex'
                justifyContent='center'
                alignItems='center'
              >
                <Typography
                  component={Link}
                  href='/auth/password-reset'
                  fontSize={16}
                  variant='caption-semibold'
                  color={palette.primary.main}
                >
                  {login('forgotPassword')}
                </Typography>
              </Box>
              <Divider />
              <Box
                pt={4}
                pb={8}
                display='flex'
                justifyContent='center'
                alignItems='center'
              >
                <Typography variant='body2' mr={1}>
                  {login('noAccount')}
                </Typography>
                <Typography
                  component={Link}
                  href='/auth/sign-up'
                  fontSize={16}
                  variant='caption-semibold'
                  color={palette.primary.main}
                >
                  {signUp('action')}
                </Typography>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Card>
      <Snackbar
        open={!!error}
        autoHideDuration={snackbarAutoHideDurationMs}
        onClose={() => setError(null)}
      >
        <Alert severity='error'>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginForm;
