import { LoginFunction } from '@/lib/types/loginFunction';
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
  SvgIcon,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { validateEmail, validateField } from '@/helpers/auth.helpers';

interface LoginFormProps {
  onLogin: LoginFunction;
  noAccount?: boolean;
  submitting?: boolean;
}

interface LoginFieldsError {
  email: string | null;
  password: string | null;
}

const LoginForm = ({
  onLogin,
  noAccount = false,
  submitting = false,
}: LoginFormProps) => {
  const signUp = useTranslations('auth.signUp');
  const login = useTranslations('auth.login');
  const shared = useTranslations('shared');

  const { palette } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldsError>({
    email: null,
    password: null,
  });

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

  const handleChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (fieldErrors.email || fieldErrors.password) {
        setFieldErrors({
          email: null,
          password: null,
        });
      }

      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [fieldErrors]
  );

  const validateForm = useCallback(() => {
    const emailError = validateEmail(formData.username);
    const passwordError = validateField(formData.password);

    setFieldErrors({
      email: emailError ? shared(emailError) : null,
      password: passwordError ? shared(passwordError) : null,
    });

    return !emailError && !passwordError;
  }, [shared, formData]);

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

    if (!valid) return;

    onLogin(formData);
  }, [validateForm, onLogin, formData]);

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
                <SvgIcon
                  viewBox='0 0 120 120'
                  sx={{ fontSize: 80, color: 'secondary.main' }}
                >
                  <path d='M110.625 5.625H9.375A5.632 5.632 0 0 0 3.75 11.25v97.5a5.634 5.634 0 0 0 5.625 5.625h101.25a5.637 5.637 0 0 0 3.976-1.649 5.637 5.637 0 0 0 1.649-3.976v-97.5a5.634 5.634 0 0 0-5.625-5.625ZM9.375 9.375h101.25a1.876 1.876 0 0 1 1.875 1.875v9.375H7.5V11.25a1.877 1.877 0 0 1 1.875-1.875Zm101.25 101.25H9.375A1.877 1.877 0 0 1 7.5 108.75V24.375h105v84.375a1.876 1.876 0 0 1-1.875 1.875Z' />
                  <path d='M28.125 16.875a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75ZM20.625 16.875a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75ZM13.125 16.875a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75ZM82.5 76.875h-45a1.875 1.875 0 0 0-1.875 1.875v7.5a1.875 1.875 0 0 0 1.875 1.875h45a1.875 1.875 0 0 0 1.875-1.875v-7.5a1.875 1.875 0 0 0-1.875-1.875Zm-43.125 3.75h3.75v3.75h-3.75v-3.75Zm41.25 3.75h-33.75v-3.75h33.75v3.75ZM82.5 91.875h-45a1.875 1.875 0 0 0-1.875 1.875v7.5a1.876 1.876 0 0 0 1.875 1.875h45a1.877 1.877 0 0 0 1.875-1.875v-7.5a1.875 1.875 0 0 0-1.875-1.875Zm-43.125 3.75h3.75v3.75h-3.75v-3.75Zm41.25 3.75h-33.75v-3.75h33.75v3.75ZM60 73.125a20.629 20.629 0 1 0 .007-41.257A20.629 20.629 0 0 0 60 73.125Zm-11.983-8.75c2.104-6.022 6.816-10 11.983-10 5.167 0 9.88 3.978 11.982 10a16.857 16.857 0 0 1-23.965 0Zm8.233-17.5a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM60 35.625a16.869 16.869 0 0 1 14.616 25.301c-2.018-4.263-5.222-7.483-8.979-9.112a7.5 7.5 0 1 0-11.273 0c-3.757 1.63-6.961 4.85-8.98 9.112A16.87 16.87 0 0 1 60 35.625Z' />
                </SvgIcon>
              </Stack>
              <Typography variant='h4' pt={8} mb={4} textAlign='center'>
                {login('loginToYourAccount')}
              </Typography>
              <Stack spacing={2} mb={4}>
                <TextField
                  autoComplete={'username'}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                  inputProps={{
                    'aria-label': 'email',
                    name: 'username',
                  }}
                  label={shared('emailAddress')}
                  required
                  size='small'
                  sx={{
                    width: '100%',
                    backgroundColor: palette.background.paper,
                    '& .MuiInputBase-input': { fontWeight: 600 },
                  }}
                  value={formData.username}
                  variant='outlined'
                  onChange={handleChangeInput}
                />
              </Stack>
              <Stack spacing={2} mb={2}>
                <FormControl variant='outlined' size='small'>
                  <TextField
                    autoComplete={'current-password'}
                    error={!!fieldErrors.password}
                    id='password-input'
                    inputProps={{
                      'aria-label': 'password',
                      name: 'password',
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge='end'
                            sx={{ color: 'action.active' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    label={`${shared('password')}`}
                    required
                    size='small'
                    sx={{ '& .MuiInputBase-input': { fontWeight: 600 } }}
                    type={showPassword ? 'text' : 'password'}
                    variant='outlined'
                    onChange={handleChangeInput}
                  />
                  {fieldErrors.password && (
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
