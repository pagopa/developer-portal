'use client';
import { translations } from '@/_contents/translations';
import { SignUpFunction } from '@/lib/types/signUpFunction';
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
} from '@mui/material';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MouseEvent, useCallback, useState } from 'react';

interface SignUpFormProps {
  onSignUp: SignUpFunction;
}

const SignUpForm = ({ onSignUp }: SignUpFormProps) => {
  const {
    auth: { signUp },
    shared,
  } = translations;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const onSignUpClick = useCallback(() => {
    if (password !== confirmPassword) {
      return;
    }

    onSignUp({
      username,
      password,
      firstName,
      lastName,
      company,
      role,
    });
  }, [
    company,
    confirmPassword,
    firstName,
    lastName,
    onSignUp,
    password,
    role,
    username,
  ]);

  if (authStatus === 'authenticated') {
    redirect('/');
  }

  return (
    <Box component='section'>
      <Card variant='outlined'>
        <Grid container justifyContent='center'>
          <Grid item xs={11}>
            <Typography variant='h3' pt={8} mb={4} textAlign='center'>
              {signUp.createYourAccount}
            </Typography>
            <Typography variant='body1' mb={2}>
              {shared.requiredFields}
            </Typography>
            <form>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <TextField
                    placeholder={shared.firstName}
                    variant='outlined'
                    size='small'
                    required
                    onChange={(e) => setFirstName(e.target.value)}
                    sx={{
                      backgroundColor: 'white',
                      width: '100%',
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    placeholder={shared.lastName}
                    variant='outlined'
                    size='small'
                    required
                    onChange={(e) => setLastName(e.target.value)}
                    sx={{
                      backgroundColor: 'white',
                      width: '100%',
                    }}
                  />
                </Grid>
              </Grid>
              <Stack spacing={2} mb={2}>
                <TextField
                  placeholder={shared.emailAddress}
                  variant='outlined'
                  size='small'
                  type='email'
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{
                    backgroundColor: 'white',
                  }}
                />
              </Stack>
              <Stack spacing={2} mb={2}>
                <FormControl variant='outlined'>
                  <InputLabel htmlFor='password-input' sx={{ top: '-8px' }}>
                    {shared.password}
                  </InputLabel>
                  <OutlinedInput
                    id='password-input'
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
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
                    label={shared.password}
                    inputProps={{
                      sx: {
                        padding: '8.5px 14px',
                      },
                    }}
                  />
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
                    label={shared.confirmPassword}
                    error={password !== confirmPassword}
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
                  placeholder={shared.role}
                  variant='outlined'
                  size='small'
                  required
                  onChange={(e) => setRole(e.target.value)}
                  sx={{
                    backgroundColor: 'white',
                  }}
                />
              </Stack>
              <Grid container mb={1}>
                <FormControlLabel
                  control={<Checkbox sx={{ paddingTop: '4px' }} />}
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
                  <Typography variant='body1'>{signUp.acceptPolicy}</Typography>
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
