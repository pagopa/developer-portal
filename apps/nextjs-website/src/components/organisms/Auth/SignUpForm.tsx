'use client';
import {
  validateEmail,
  validateField,
  validatePassword,
} from '@/helpers/auth.helpers';
import { SignUpUserData } from '@/lib/types/sign-up';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { companyRoles } from '@/_contents/auth';
import { PasswordTextField } from './PasswordTextField';
import Policy from './Policy';

const defaults = {
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  mailinglistAccepted: false,
  role: '',
  company: '',
  confirmPassword: '',
};

interface SignUpFormProps {
  // eslint-disable-next-line functional/no-return-void
  onSignUp: (userData: SignUpUserData) => void;
  userAlreadyExist: boolean;
  submitting?: boolean;
}

interface SignUpFieldsError {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm = ({
  onSignUp,
  userAlreadyExist,
  submitting = false,
}: SignUpFormProps) => {
  const login = useTranslations('auth.login');
  const signUp = useTranslations('auth.signUp');
  const shared = useTranslations('shared');
  const { palette } = useTheme();
  const [userData, setUserData] = useState<SignUpUserData>(defaults);
  const [fieldErrors, setFieldErrors] = useState<Partial<SignUpFieldsError>>(
    {}
  );

  const validateForm = useCallback(() => {
    const { username, confirmPassword, firstName, lastName, password } =
      userData;

    const nameError = validateField(firstName);
    const surnameError = validateField(lastName);
    const emailError = validateEmail(username);
    const emailEmptyError = validateField(username);
    const passwordError = validatePassword(password);
    const confirmPasswordError = password !== confirmPassword;

    // eslint-disable-next-line functional/no-let
    let errors = {};

    if (nameError) {
      errors = { ...errors, name: shared('requiredFieldError') };
    }

    if (surnameError) {
      errors = { ...errors, surname: shared('requiredFieldError') };
    }

    if (emailEmptyError) {
      errors = { ...errors, email: shared('requiredFieldError') };
    } else if (emailError) {
      errors = { ...errors, email: shared(emailError) };
    }

    if (passwordError) {
      errors = { ...errors, password: signUp('passwordPolicy') };
    }

    if (confirmPasswordError) {
      errors = { ...errors, confirmPassword: signUp('passwordMismatchError') };
    }

    setFieldErrors(errors);

    return (
      !nameError &&
      !surnameError &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError
    );
  }, [shared, signUp, userData]);

  const setEmailErrorIfUserExists = useCallback(() => {
    if (userAlreadyExist) {
      setFieldErrors((prevFieldErrors) => ({
        ...prevFieldErrors,
        email: shared('emailAlreadyTaken'),
      }));
    }
  }, [userAlreadyExist, shared]);

  const onSignUpClick = useCallback(() => {
    if (validateForm()) {
      onSignUp(userData);
    }
  }, [onSignUp, userData, validateForm]);

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = ev.target;

    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setEmailErrorIfUserExists();
  }, [userAlreadyExist, setEmailErrorIfUserExists]);

  const hasConfirmPasswordError = !!fieldErrors.confirmPassword;
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
            <Box component='form' display='flex' flexDirection='column' gap={2}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    error={!!fieldErrors.name}
                    helperText={fieldErrors.name}
                    inputProps={{ 'aria-label': 'firstname' }}
                    label={shared('firstName')}
                    name='firstName'
                    required
                    sx={{
                      backgroundColor: 'white',
                      width: '100%',
                    }}
                    size='small'
                    value={firstName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    error={!!fieldErrors.surname}
                    helperText={fieldErrors.surname}
                    inputProps={{ 'aria-label': 'lastname' }}
                    label={shared('lastName')}
                    name='lastName'
                    required
                    sx={{
                      backgroundColor: 'white',
                      width: '100%',
                    }}
                    size='small'
                    value={lastName}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              <Stack spacing={2}>
                <TextField
                  autoComplete={'username'}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                  inputProps={{ 'aria-label': 'email' }}
                  label={shared('emailAddress')}
                  name='username'
                  required
                  sx={{
                    backgroundColor: 'white',
                    width: '100%',
                  }}
                  size='small'
                  value={username}
                  onChange={handleInputChange}
                />
              </Stack>
              <PasswordTextField
                id='password'
                label={`${shared('password')}`}
                hasError={!!fieldErrors.password}
                helperText={
                  <>
                    {fieldErrors.password ? `${signUp('passwordError')} ` : ''}
                    <Box component='span'>{signUp('passwordPolicy')}</Box>
                  </>
                }
                value={password}
                onChange={handleInputChange}
              />
              <PasswordTextField
                id='confirmPassword'
                label={`${shared('confirmPassword')}`}
                hasError={hasConfirmPasswordError}
                helperText={
                  hasConfirmPasswordError ? signUp('passwordMismatchError') : ''
                }
                value={confirmPassword}
                onChange={handleInputChange}
              />
              <Stack spacing={2}>
                <FormControl fullWidth variant='outlined' size='small'>
                  <TextField
                    id='company-field-select'
                    inputProps={{
                      sx: { padding: '8.5px 14px' },
                    }}
                    label={shared('company')}
                    name='company'
                    select={true}
                    size='small'
                    value={company}
                    onChange={handleInputChange}
                  >
                    {companyRoles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {signUp(`companyRoles.${role}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Stack>
              <Stack spacing={2}>
                <TextField
                  label={shared('role')}
                  name='role'
                  sx={{
                    backgroundColor: palette.background.paper,
                  }}
                  size='small'
                  value={role}
                  variant='outlined'
                  onChange={handleInputChange}
                />
              </Stack>
              <Grid container>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={mailinglistAccepted}
                      sx={{ marginTop: '-4px' }}
                      onChange={handleInputChange}
                    />
                  }
                  label={signUp('confirmComunications')}
                  sx={{ alignItems: 'flex-start' }}
                />
              </Grid>
              <Stack pt={3}>
                <Stack direction='row' justifyContent='center'>
                  <Button
                    variant='contained'
                    onClick={onSignUpClick}
                    disabled={submitting}
                  >
                    {signUp('action')}
                  </Button>
                </Stack>
              </Stack>
              <Stack spacing={4} pt={2} pb={4}>
                <Stack direction='row' justifyContent='center'>
                  <Policy />
                </Stack>
              </Stack>
            </Box>
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
