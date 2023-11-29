'use client';
import IconInbox from '@/components/atoms/IconInbox/IconInbox';
import {
  Box,
  Typography,
  Stack,
  Grid,
  Divider,
  Card,
  Link,
} from '@mui/material';
import ResendEmail from '@/components/molecules/ResendEmail/ResendEmail';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { Auth } from 'aws-amplify';

interface ConfirmSignUpProps {
  email: string;
  onBack: () => null;
}

const ConfirmSignUp = ({ email, onBack }: ConfirmSignUpProps) => {
  const confirmSignUp = useTranslations('auth.confirmSignUp');
  const shared = useTranslations('shared');

  const onResendEmail = useCallback(() => {
    const result = Auth.resendSignUp(email).catch((e) => {
      return new Error(e);
    });
    return result;
  }, [email]);

  return (
    <Box component='section'>
      <Card variant='elevation' elevation={8}>
        <Grid container justifyContent='center'>
          <Grid item xs={11}>
            <Stack pt={4} display='flex' alignItems='center'>
              <IconInbox />
            </Stack>
            <Typography variant='h4' pt={5} mb={4} textAlign='center'>
              {confirmSignUp('title')}
            </Typography>
            <Typography
              variant='body2'
              mb={2}
              dangerouslySetInnerHTML={{
                __html: confirmSignUp
                  .raw('emailSent')
                  .replace('{email}', email),
              }}
            ></Typography>

            <ResendEmail
              text={confirmSignUp('didntReceiveEmail')}
              onResendEmail={onResendEmail}
            />
            <Divider />
            <Stack
              pt={4}
              pb={8}
              display='flex'
              alignItems='center'
              justifyContent='center'
              flexDirection='row'
            >
              <Typography variant='body1' mr={1}>
                {confirmSignUp('wrongEmail')}
              </Typography>
              <Link
                variant='body2'
                onClick={onBack}
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              >
                {shared('goBack')}
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ConfirmSignUp;
