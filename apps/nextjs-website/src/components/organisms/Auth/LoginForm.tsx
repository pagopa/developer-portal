'use client';
import { translations } from '@/_contents/translations';
import IconLogin from '@/components/atoms/IconLogin/IconLogin';
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
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Auth } from 'aws-amplify';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MouseEvent, useCallback, useState } from 'react';

const LoginForm = () => {
  const {
    auth: { login },
    shared,
  } = translations;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const onLogin = useCallback(() => {
    Auth.signIn(username, password);
  }, [password, username]);

  return (
    <Box component='section' width='35vw'>
      <Card variant='outlined'>
        <Grid container justifyContent='center'>
          <Grid item xs={10}>
            <form>
              <Stack pt={4} display='flex' alignItems='center'>
                <IconLogin />
              </Stack>
              <Typography variant='h3' pt={8} mb={4} textAlign='center'>
                {login.loginToYourAccount}
              </Typography>
              <Stack spacing={2} mb={4}>
                <TextField
                  label={shared.emailAddress}
                  variant='outlined'
                  size='small'
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
              <Grid container mb={1}>
                <FormControlLabel
                  control={<Checkbox />}
                  label={login.rememberMe}
                />
              </Grid>
              <Stack spacing={4} pt={4} pb={8}>
                <Stack direction='row' justifyContent='center'>
                  <Button variant='contained' onClick={onLogin}>
                    {shared.login}
                  </Button>
                </Stack>
              </Stack>
              <Divider />
              <Stack spacing={4} pt={4} pb={8}>
                <Typography variant='body2' textAlign='center'>
                  {login.noAccount}{' '}
                  <Link href='/auth/sign-up'>
                    <Button variant='text'>{shared.signUp}</Button>
                  </Link>
                </Typography>
              </Stack>
            </form>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default LoginForm;
