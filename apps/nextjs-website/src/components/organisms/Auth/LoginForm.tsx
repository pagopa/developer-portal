'use client';
import { useAuthenticator } from '@aws-amplify/ui-react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Checkbox,
  Grid,
  TextField,
  Divider,
  Button,
  Card,
  FormControlLabel,
} from '@mui/material';
import { Auth } from 'aws-amplify';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useCallback } from 'react';

const LoginForm = () => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === 'authenticated') {
    redirect('/');
  }

  const onSignUp = useCallback(() => {
    Auth.signUp({
      username: 'username',
      password: 'password',
      attributes: {
        given_name: 'given_name',
        family_name: 'family_name',
      },
    });
  }, []);

  return (
    <Box component='section'>
      <Card variant='outlined'>
        <Grid container justifyContent='center'>
          <Grid item xs={11}>
            <form>
              <Typography variant='h3' pt={8} mb={4} textAlign='center'>
                Accedi al tuo account
              </Typography>
              <Stack spacing={2} mb={4}>
                <TextField
                  placeholder='Email'
                  variant='outlined'
                  size='small'
                  sx={{
                    backgroundColor: 'white',
                  }}
                />
              </Stack>
              <Grid container mb={1}>
                <FormControlLabel
                  control={<Checkbox />}
                  label='Rimani connesso per una settimana'
                />
              </Grid>
              <Stack spacing={4} pt={4} pb={8}>
                <Stack direction='row' justifyContent='center'>
                  <Button variant='contained'>Invia Richiesta</Button>
                </Stack>
              </Stack>
              <Divider />
              <Stack spacing={4} pt={4} pb={8}>
                <Typography variant='caption-semibold' textAlign='center'>
                  Non hai un account?
                </Typography>
                <Stack direction='row' justifyContent='center'>
                  <Link href='/auth/sign-up'>
                    <Button variant='outlined'>Registrati</Button>
                  </Link>
                </Stack>
              </Stack>
            </form>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default LoginForm;
