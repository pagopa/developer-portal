'use client';
import RequiredTextField, {
  ValidatorFunction,
} from '@/components/molecules/RequiredTextField/RequiredTextField';
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
  useEffect,
  useMemo,
  useState,
} from 'react';

interface SignUpFormProps {
  userData: SignUpUserData;
  setUserData: Dispatch<SetStateAction<SignUpUserData>>;
  onSignUp: () => Promise<boolean>;
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
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordDirty, setIsPasswordDirty] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const emailValidators: ValidatorFunction[] = [
    (value: string) => ({
      valid: emailMatcher.test(value),
      error: shared('emailFieldError'),
    }),
  ];

  const validatePassword = useCallback(() => {
    setIsPasswordValid(passwordMatcher.test(password));
  }, [password]);

  useEffect(() => {
    validatePassword();
  }, [password, validatePassword]);

  const onSignUpClick = useCallback(() => {
    const { username, confirmPassword, firstName, lastName, password } =
      userData;

    if (
      [firstName, lastName, username, password, confirmPassword].some(
        (value) => !value || value.trim().length === 0
      )
    ) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    setSubmitting(true);

    onSignUp().finally(() => {
      setSubmitting(false);
    });
  }, [onSignUp, userData]);

  const validateForm = useCallback(() => {
    const { username, confirmPassword, firstName, lastName, password } =
      userData;

    const areFieldsValid = [
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
    ].every((value) => value && value.trim().length > 0);
    const isPasswordEqual = password === confirmPassword;

    setIsFormValid(areFieldsValid && isPasswordEqual && isPasswordValid);
  }, [isPasswordValid, userData]);

  useEffect(() => {
    validateForm();
  }, [validateForm, isPasswordValid, userData]);

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
                  <RequiredTextField
                    label={shared('firstName')}
                    value={firstName}
                    onChange={({ target: { value } }) =>
                      setUserData((prevData) => ({
                        ...prevData,
                        firstName: value,
                      }))
                    }
                    helperText={shared('requiredFieldError')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RequiredTextField
                    label={shared('lastName')}
                    value={lastName}
                    onChange={({ target: { value } }) =>
                      setUserData((prevData) => ({
                        ...prevData,
                        lastName: value,
                      }))
                    }
                    helperText={shared('requiredFieldError')}
                  />
                </Grid>
              </Grid>
              <Stack spacing={2} mb={2}>
                <RequiredTextField
                  label={shared('emailAddress')}
                  value={username}
                  onChange={({ target: { value } }) =>
                    setUserData((prevData) => ({
                      ...prevData,
                      username: value,
                    }))
                  }
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
                    required
                    type={showPassword ? 'text' : 'password'}
                    onChange={({ target: { value } }) =>
                      setUserData((prevData) => ({
                        ...prevData,
                        password: value,
                      }))
                    }
                    onBlur={() => setIsPasswordDirty(true)}
                    error={isPasswordDirty && !isPasswordValid}
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
                  <FormHelperText error={isPasswordDirty && !isPasswordValid}>
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
                    error={isPasswordDirty && password !== confirmPassword}
                    inputProps={{
                      sx: {
                        padding: '8.5px 14px',
                      },
                    }}
                  />
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
                  <Button
                    variant='contained'
                    onClick={onSignUpClick}
                    disabled={!isFormValid || submitting}
                  >
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
