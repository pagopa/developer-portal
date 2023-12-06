'use client';
import { emailMatcher, passwordMatcher } from '@/helpers/auth.helpers';
import { SignUpUserData } from '@/lib/types/sign-up';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Typography,
  Stack,
  Checkbox,
  Grid,
  TextField,
  Divider,
  Button,
  Card,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  useTheme,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';

interface SignUpFormProps {
  userData: SignUpUserData;
  setUserData: Dispatch<SetStateAction<SignUpUserData>>;
  onSignUp: () => Promise<boolean>;
}

interface SignUpFieldsError {
  name: string | null;
  surname: string | null;
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
}

const SignUpForm = ({ userData, setUserData, onSignUp }: SignUpFormProps) => {
  const login = useTranslations('auth.login');
  const signUp = useTranslations('auth.signUp');
  const shared = useTranslations('shared');

  const {
    company,
    confirmPassword,
    firstName,
    lastName,
    password,
    role,
    username,
    mailinglistAccepted,
  } = userData;

  const { palette } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<SignUpFieldsError>({
    name: null,
    surname: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

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
    const { username, confirmPassword, firstName, lastName, password } =
      userData;

    const nameError = !firstName || firstName.trim().length === 0;
    const surnameError = !lastName || lastName.trim().length === 0;
    const emailError =
      !username || username.trim().length === 0
        ? shared('requiredFieldError')
        : !emailMatcher.test(username)
        ? shared('emailFieldError')
        : null;
    const passwordError =
      !password || password.trim().length === 0
        ? shared('requiredFieldError')
        : !passwordMatcher.test(password)
        ? shared('passwordError')
        : null;
    const confirmPasswordError = password !== confirmPassword;

    setFieldErrors({
      name: nameError ? shared('requiredFieldError') : null,
      surname: surnameError ? shared('requiredFieldError') : null,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError
        ? signUp('passwordMismatchError')
        : null,
    });

    return (
      !nameError &&
      !surnameError &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError
    );
  }, [shared, signUp, userData]);

  const onSignUpClick = useCallback(() => {
    const valid = validateForm();

    if (!valid) {
      return;
    }

    onSignUp();
  }, [onSignUp, validateForm]);

  const companyRoles = useMemo(
    () => [
      'ente-pubblico',
      'partner-tecnologico',
      'psp',
      'gestore-di-pubblico-servizio',
      'azienda-privata',
      'altro',
    ],
    []
  );

  if (authStatus === 'authenticated') {
    redirect('/');
  }

  return (
    <Box component='section'>
      <Card variant='elevation' elevation={8}>
        <Grid container justifyContent='center'>
          <Grid item xs={11}>
            <Typography variant='h4' pt={4} mb={4} textAlign='center'>
              {signUp('createYourAccount')}
            </Typography>
            <Typography variant='body2' mb={2}>
              {shared('requiredFields')}
            </Typography>
            <form>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <TextField
                    size='small'
                    label={shared('firstName')}
                    value={firstName}
                    onChange={({ target: { value } }) =>
                      setUserData((prevData) => ({
                        ...prevData,
                        firstName: value,
                      }))
                    }
                    helperText={fieldErrors.name}
                    error={!!fieldErrors.name}
                    sx={{
                      backgroundColor: 'white',
                      width: '100%',
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    size='small'
                    label={shared('lastName')}
                    value={lastName}
                    onChange={({ target: { value } }) =>
                      setUserData((prevData) => ({
                        ...prevData,
                        lastName: value,
                      }))
                    }
                    helperText={fieldErrors.surname}
                    error={!!fieldErrors.surname}
                    sx={{
                      backgroundColor: 'white',
                      width: '100%',
                    }}
                  />
                </Grid>
              </Grid>
              <Stack spacing={2} mb={2}>
                <TextField
                  size='small'
                  label={shared('emailAddress')}
                  value={username}
                  onChange={({ target: { value } }) =>
                    setUserData((prevData) => ({
                      ...prevData,
                      username: value,
                    }))
                  }
                  helperText={fieldErrors.email}
                  error={!!fieldErrors.email}
                  sx={{
                    backgroundColor: 'white',
                    width: '100%',
                  }}
                />
              </Stack>
              <Stack spacing={2} mb={2}>
                <FormControl variant='outlined'>
                  <InputLabel htmlFor='password-input' sx={{ top: '-8px' }}>
                    {shared('password')}
                  </InputLabel>
                  <OutlinedInput
                    id='password-input'
                    required
                    type={showPassword ? 'text' : 'password'}
                    onChange={({ target: { value } }) =>
                      setUserData((prevData) => ({
                        ...prevData,
                        password: value,
                      }))
                    }
                    error={!!fieldErrors.password}
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
                    inputProps={{
                      sx: {
                        padding: '8.5px 14px',
                      },
                    }}
                  />
                  <FormHelperText error={!!fieldErrors.password}>
                    {fieldErrors.password ? `${signUp('passwordError')} ` : ''}
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
                      setUserData((prevData) => ({
                        ...prevData,
                        confirmPassword: value,
                      }))
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
                    value={confirmPassword}
                    label={shared('confirmPassword')}
                    error={!!fieldErrors.confirmPassword}
                    inputProps={{
                      sx: {
                        padding: '8.5px 14px',
                      },
                    }}
                  />
                  {fieldErrors.confirmPassword && (
                    <FormHelperText error>
                      {signUp('passwordMismatchError')}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
              <Stack spacing={2} mb={2}>
                <FormControl fullWidth>
                  <InputLabel id='company-field' sx={{ top: '-8px' }}>
                    {shared('company')}
                  </InputLabel>
                  <Select
                    labelId='company-field'
                    id='company-field-select'
                    value={company}
                    label={shared('company')}
                    onChange={({ target: { value } }) =>
                      setUserData((prevData) => ({
                        ...prevData,
                        company: value,
                      }))
                    }
                    sx={{ padding: '8.5px 14px' }}
                    inputProps={{
                      sx: {
                        padding: 0,
                      },
                    }}
                  >
                    {companyRoles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {signUp(`companyRoles.${role}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Stack spacing={2} mb={2}>
                <TextField
                  label={shared('role')}
                  variant='outlined'
                  size='small'
                  onChange={({ target: { value } }) =>
                    setUserData((prevData) => ({
                      ...prevData,
                      role: value,
                    }))
                  }
                  value={role}
                  sx={{
                    backgroundColor: 'white',
                  }}
                />
              </Stack>
              <Grid container mb={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={mailinglistAccepted}
                      onChange={({ target: { checked } }) =>
                        setUserData((prevData) => ({
                          ...prevData,
                          mailinglistAccepted: checked,
                        }))
                      }
                      sx={{ marginTop: '-4px' }}
                    />
                  }
                  label={signUp('confirmComunications')}
                  sx={{ alignItems: 'flex-start' }}
                />
              </Grid>
              <Stack spacing={4} pt={4} pb={2}>
                <Stack direction='row' justifyContent='center'>
                  <Button variant='contained' onClick={onSignUpClick}>
                    {signUp('action')}
                  </Button>
                </Stack>
              </Stack>
              <Stack spacing={4} pt={2} pb={4}>
                <Stack direction='row' justifyContent='center'>
                  <Typography variant='body2'>
                    {signUp('acceptPolicy1')}
                    <Typography
                      component={Link}
                      fontSize={16}
                      href='/privacy-policy'
                      variant='caption-semibold'
                      color={palette.primary.main}
                    >
                      {' '}
                      {signUp('acceptPolicy2')}{' '}
                    </Typography>
                    {signUp('acceptPolicy3')}
                  </Typography>
                </Stack>
              </Stack>
            </form>
            <Divider />
            <Stack
              pt={4}
              pb={4}
              display='flex'
              alignItems='center'
              justifyContent='center'
              flexDirection='row'
            >
              <Typography variant='body2' mr={1}>
                {signUp('alreadyHaveAnAccount')}
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

export default SignUpForm;
