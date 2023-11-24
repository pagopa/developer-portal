'use client';
import { translations } from '@/_contents/translations';
import {
  Box,
  Grid,
  Card,
  Snackbar,
  Alert,
  Link,
  Stack,
  Typography,
  TextField,
  Divider,
  Button,
} from '@mui/material';
import { IllusEmailValidation } from '@pagopa/mui-italia';
import { useCallback, useState } from 'react';

interface confirmLoginProps {
  onBackStep: () => null;
  onConfirmLogin: (code: string) => Promise<void>;
}

const ConfirmLogin = ({ onBackStep, onConfirmLogin }: confirmLoginProps) => {
  const {
    auth: { confirmLogin },
    shared,
  } = translations;

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState<string>('');

  const onConfirmLoginHandler = useCallback(() => {
    setSubmitting(true);
    onConfirmLogin(code).catch((e) => {
      setError(e.message);
      setSubmitting(false);
    });
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
            <Typography variant='h4' pt={8} mb={4} textAlign='center'>
              {confirmLogin.title}
            </Typography>
            <Typography variant='body2' mb={2}>
              {confirmLogin.body}
            </Typography>
            <Stack spacing={2} mb={4}>
              <TextField
                label={confirmLogin.code}
                variant='outlined'
                size='small'
                onChange={(e) => setCode(e.target.value)}
                sx={{
                  backgroundColor: 'white',
                }}
              />
            </Stack>
            <Stack spacing={4} pt={4} pb={2}>
              <Stack direction='row' justifyContent='center'>
                <Button
                  variant='contained'
                  disabled={submitting}
                  onClick={onConfirmLoginHandler}
                >
                  {confirmLogin.send}
                </Button>
              </Stack>
            </Stack>
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
                {confirmLogin.wrongAccount}
              </Typography>
              <Link
                variant='body2'
                onClick={onBackStep}
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              >
                {shared.goBack}
              </Link>
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
