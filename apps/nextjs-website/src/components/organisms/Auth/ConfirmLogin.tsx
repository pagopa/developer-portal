'use client';
import { translations } from '@/_contents/translations';
import {
  Box,
  Grid,
  Card,
  Snackbar,
  Alert,
  Stack,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { IllusEmailValidation } from '@pagopa/mui-italia';
import { useCallback, useState } from 'react';
import ResendEmail from '@/components/molecules/ResendEmail/ResendEmail';

interface confirmLoginProps {
  email: string | null;
  onConfirmLogin: (code: string) => Promise<void>;
}

const ConfirmLogin = ({ email, onConfirmLogin }: confirmLoginProps) => {
  const {
    auth: { confirmLogin },
  } = translations;

  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string>('');

  const onConfirmLoginHandler = useCallback(() => {
    onConfirmLogin(code).catch((e) => setError(e.message));
  }, [onConfirmLogin, code]);

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
            <Stack pt={4} display='flex' alignItems='center'>
              <IllusEmailValidation />
            </Stack>
            <Typography variant='h4' pt={8} mb={5} textAlign='center'>
              {confirmLogin.title}
            </Typography>
            {email && (
              <Typography
                variant='body2'
                mb={6}
                dangerouslySetInnerHTML={{
                  __html: confirmLogin.body(email),
                }}
              />
            )}
            <Typography
              variant='body1'
              sx={{ marginBottom: 1.5, fontWeight: 600 }}
            >
              {confirmLogin.code}
            </Typography>
            <Stack spacing={2} mb={4}>
              <TextField
                variant='outlined'
                size='small'
                onChange={(e) => setCode(e.target.value)}
                sx={{
                  backgroundColor: 'white',
                }}
              />
            </Stack>
            {email && (
              <ResendEmail email={email} text={confirmLogin.checkJunkMail} />
            )}
            <Stack spacing={4} pt={4} pb={2}>
              <Stack direction='row' justifyContent='center'>
                <Button variant='contained' onClick={onConfirmLoginHandler}>
                  {confirmLogin.continue}
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Card>
      <Snackbar
        open={!!error}
        autoHideDuration={2000}
        onClose={() => setError(null)}
      >
        <Alert severity='error'>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfirmLogin;
