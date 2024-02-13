'use client';
import { LoginFunction } from '@/lib/types/loginFunction';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { IllusLogin } from '@pagopa/mui-italia';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { validateEmail, validateField } from '@/helpers/auth.helpers';

interface LoginFormProps {
  onLogin: LoginFunction;
  noAccount: boolean;
}

interface LoginFieldsError {
  email: string | null;
  password: string | null;
}

const LoginForm = ({ onLogin, noAccount = false }: LoginFormProps) => {
  const signUp = useTranslations('auth.signUp');
  const login = useTranslations('auth.login');
  const shared = useTranslations('shared');
  const errors = useTranslations('errors');

  const { palette } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  const [fieldErrors, setFieldErrors] = useState<LoginFieldsError>({
    email: null,
    password: null,
  });

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

  const validateForm = useCallback(() => {
    const emailError = validateEmail(username);

    const passwordError = validateField(password);
    setFieldErrors({
      email: emailError ? shared(emailError) : null,
      password: passwordError ? shared(passwordError) : null,
    });

    return !emailError && !passwordError;
  }, [username, shared, password]);

  const setNotloggedOnError = useCallback(() => {
    if (noAccount) {
      setFieldErrors((prevFieldErrors) => ({
        ...prevFieldErrors,
        email: login('noAccountError'),
        password: login('noAccountError'),
      }));
    }
  }, [noAccount, login]);

  useEffect(() => {
    setNotloggedOnError();
  }, [noAccount, setNotloggedOnError]);

  const onLoginHandler = useCallback(() => {
    const valid = validateForm();
    if (!valid) {
      return;
    }
    setSubmitting(true);
    onLogin({ username, password }).finally(() => {
      setSubmitting(false);
    });
  }, [validateForm, onLogin, username, password, errors]);

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
                <TextField
                  label={shared('emailAddress')}
                  variant='outlined'
                  size='small'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  helperText={fieldErrors.email}
                  error={!!fieldErrors.email || noAccount}
                  required
                  sx={{
                    width: '100%',
                    backgroundColor: palette.background.paper,
                  }}
                  autoComplete={'username'}
                />
              </Stack>
              <Stack spacing={2} mb={2}>
                <FormControl variant='outlined' size='small'>
                  <TextField
                    id='password-input'
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
                    label={`${shared('password')}`}
                    variant='outlined'
                    size='small'
                    error={!!fieldErrors.password || noAccount}
                    required
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
                    autoComplete={'current-password'}
                  />
                  {(fieldErrors.password || noAccount) && (
                    <FormHelperText error>
                      {fieldErrors.password}
                    </FormHelperText>
                  )}
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
                    variant='contained'
                    onClick={onLoginHandler}
                    disabled={submitting}
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
    </Box>
  );
};

export default LoginForm;
