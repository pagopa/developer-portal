'use client';
import {
  Box,
  Grid,
  Card,
  Stack,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { IllusEmailValidation } from '@pagopa/mui-italia';
import { useCallback, useState } from 'react';
import ResendEmail from '@/components/molecules/ResendEmail/ResendEmail';
import { useTranslations } from 'next-intl';
import { useTheme } from '@mui/material';

interface confirmLoginProps {
  email: string | null;
  onConfirmLogin: (code: string) => Promise<void>;
  resendCode: () => Promise<boolean>;
}

const ConfirmLogin = ({
  email,
  onConfirmLogin,
  resendCode,
}: confirmLoginProps) => {
  const confirmLogin = useTranslations('auth.confirmLogin');

  const { palette } = useTheme();
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState<string>('');
  const [codeError, setCodeError] = useState<boolean>(false);
  const [emptyCode, setEmptyCode] = useState<boolean>(false);

  const onConfirmLoginHandler = useCallback(() => {
    setCodeError(false);
    setEmptyCode(false);
    setSubmitting(true);

    onConfirmLogin(code).catch((e) => {
      if (e.message === 'Challenge response cannot be empty') {
        setEmptyCode(true);
      } else if (e.name === 'NotAuthorizedException') {
        setCodeError(true);
      }
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
            <Typography variant='h4' pt={8} mb={5} textAlign='center'>
              {confirmLogin('title')}
            </Typography>
            {email && (
              <Typography
                variant='body2'
                mb={6}
                dangerouslySetInnerHTML={{
                  __html: confirmLogin.raw('body').replace('{email}', email),
                }}
              />
            )}
            <Typography
              variant='body1'
              sx={{ marginBottom: 1.5, fontWeight: 600 }}
            >
              {confirmLogin('code')}
            </Typography>
            <Stack spacing={2} mb={4}>
              <TextField
                variant='outlined'
                size='small'
                onChange={(e) => setCode(e.target.value)}
                helperText={
                  codeError
                    ? confirmLogin('invalidCode')
                    : emptyCode
                    ? confirmLogin('emptyCode')
                    : ''
                }
                error={codeError || emptyCode}
                sx={{
                  backgroundColor: palette.background.paper,
                }}
              />
            </Stack>
            {email && (
              <ResendEmail
                isLoginCTA={true}
                resendCode={resendCode}
                setSubmitting={setSubmitting}
                email={email}
                text={confirmLogin('checkJunkMail')}
              />
            )}
            <Stack spacing={4} pt={4} pb={4}>
              <Stack direction='row' justifyContent='center'>
                <Button
                  variant='contained'
                  disabled={submitting}
                  onClick={onConfirmLoginHandler}
                >
                  {confirmLogin('continue')}
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ConfirmLogin;
