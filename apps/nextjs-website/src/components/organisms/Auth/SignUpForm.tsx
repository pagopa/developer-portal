'use client';
import { translations } from '@/_contents/translations';
import RequiredTextField, {
  ValidatorFunction,
} from '@/components/molecules/RequiredTextField/RequiredTextField';
import { emailMatcher, passwordMatcher } from '@/helpers/auth.helpers';
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
} from '@mui/material';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

interface SignUpFormProps {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  company: string;
  role: string;
  mailinglistAccepted: boolean;

  setUsername: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  setFirstName: Dispatch<SetStateAction<string>>;
  setLastName: Dispatch<SetStateAction<string>>;
  setCompany: Dispatch<SetStateAction<string>>;
  setRole: Dispatch<SetStateAction<string>>;
  setMailinglistAccepted: Dispatch<SetStateAction<boolean>>;

  onSignUp: () => Promise<boolean>;
}

const SignUpForm = ({
  username,
  password,
  confirmPassword,
  firstName,
  lastName,
  company,
  role,
  mailinglistAccepted,
  setUsername,
  setPassword,
  setConfirmPassword,
  setFirstName,
  setLastName,
  setCompany,
  setRole,
  setMailinglistAccepted,

  onSignUp,
}: SignUpFormProps) => {
  const {
    auth: { signUp },
    shared,
  } = translations;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordDirty, setIsPasswordDirty] = useState(false);

  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const emailValidators: ValidatorFunction[] = [
    (value: string) => ({
      valid: emailMatcher.test(value),
      error: shared.emailFieldError,
    }),
  ];

  const validatePassword = useCallback(() => {
    setIsPasswordValid(passwordMatcher.test(password));
  }, [password]);

  useEffect(() => {
    validatePassword();
  }, [password, validatePassword]);

  const onSignUpClick = useCallback(() => {
    if (
      !firstName ||
      firstName?.trim().length === 0 ||
      !lastName ||
      lastName?.trim().length === 0 ||
      !username ||
      username?.trim().length === 0 ||
      !password ||
      password?.trim().length === 0 ||
      !confirmPassword ||
      confirmPassword?.trim().length === 0
    ) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    onSignUp();
  }, [confirmPassword, firstName, lastName, onSignUp, password, username]);

  if (authStatus === 'authenticated') {
    redirect('/');
  }

  return (
    <Box component='section'>
      <Card variant='outlined' elevation={8}>
        <Grid container justifyContent='center'>
          <Grid item xs={11}>
            <Typography variant='h4' pt={8} mb={4} textAlign='center'>
              {signUp.createYourAccount}
            </Typography>
            <Typography variant='body2' mb={2}>
              {shared.requiredFields}
            </Typography>
            <form>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <RequiredTextField
                    label={shared.firstName}
                    value={firstName}
                    onChange={({ target: { value } }) => setFirstName(value)}
                    helperText={shared.requiredFieldError}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RequiredTextField
                    label={shared.lastName}
                    value={lastName}
                    onChange={({ target: { value } }) => setLastName(value)}
                    helperText={shared.requiredFieldError}
                  />
                </Grid>
              </Grid>
              <Stack spacing={2} mb={2}>
                <RequiredTextField
                  label={shared.emailAddress}
                  value={username}
                  onChange={({ target: { value } }) => {
                    setUsername(value);
                  }}
                  helperText={shared.emailFieldError}
                  customValidators={emailValidators}
                />
              </Stack>
              <Stack spacing={2} mb={2}>
                <FormControl variant='outlined'>
                  <InputLabel htmlFor='password-input' sx={{ top: '-8px' }}>
                    {shared.password}
                  </InputLabel>
                  <OutlinedInput
                    id='password-input'
                    required
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
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
                    label={shared.password}
                    inputProps={{
                      sx: {
                        padding: '8.5px 14px',
                      },
                    }}
                  />
                  <FormHelperText error={isPasswordDirty && !isPasswordValid}>
                    {signUp.passwordPolicy}
                  </FormHelperText>
                </FormControl>
              </Stack>
              <Stack spacing={2} mb={2}>
                <FormControl variant='outlined'>
                  <InputLabel
                    htmlFor='confirm-password-input'
                    sx={{ top: '-8px' }}
                  >
                    {shared.confirmPassword}
                  </InputLabel>
                  <OutlinedInput
                    id='confirm-password-input'
                    type={showPassword ? 'text' : 'password'}
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle confirm password visibility'
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownConfirmPassword}
                          edge='end'
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    value={confirmPassword}
                    label={shared.confirmPassword}
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
                    {shared.company}
                  </InputLabel>
                  <Select
                    labelId='company-field'
                    id='company-field-select'
                    value={company}
                    label={shared.company}
                    onChange={(e) => setCompany(e.target.value)}
                    sx={{ padding: '8.5px 14px' }}
                    inputProps={{
                      sx: {
                        padding: 0,
                      },
                    }}
                  >
                    <MenuItem value='a'>a</MenuItem>
                    <MenuItem value='b'>b</MenuItem>
                    <MenuItem value='c'>c</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Stack spacing={2} mb={2}>
                <TextField
                  label={shared.role}
                  variant='outlined'
                  size='small'
                  onChange={(e) => setRole(e.target.value)}
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
                        setMailinglistAccepted(checked)
                      }
                      sx={{ marginTop: '-4px' }}
                    />
                  }
                  label={signUp.confirmComunications}
                  sx={{ alignItems: 'flex-start' }}
                />
              </Grid>
              <Stack spacing={4} pt={4} pb={2}>
                <Stack direction='row' justifyContent='center'>
                  <Button variant='contained' onClick={onSignUpClick}>
                    {shared.signUp}
                  </Button>
                </Stack>
              </Stack>
              <Stack spacing={4} pt={2} pb={4}>
                <Stack direction='row' justifyContent='center'>
                  <Typography variant='body2'>{signUp.acceptPolicy}</Typography>
                </Stack>
              </Stack>
            </form>
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
                {signUp.alreadyHaveAnAccount}
              </Typography>
              <Link href='/auth/login'>{shared.login}</Link>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default SignUpForm;
