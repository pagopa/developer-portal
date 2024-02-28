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
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { IllusLogin } from '@pagopa/mui-italia';
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

  const handleChangeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

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
                <IllusLogin />
              </Stack>
              <Typography variant='h4' pt={8} mb={4} textAlign='center'>
                {login('loginToYourAccount')}
              </Typography>
              <Stack spacing={2} mb={4}>
                <TextField
                  autoComplete={'username'}
                  error={!!fieldErrors.email || noAccount}
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
                    error={!!fieldErrors.password || noAccount}
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
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    label={`${shared('password')}`}
                    required
                    size='small'
                    type={showPassword ? 'text' : 'password'}
                    variant='outlined'
                    onChange={handleChangeInput}
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
