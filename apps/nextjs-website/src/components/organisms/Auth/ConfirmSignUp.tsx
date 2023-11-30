'use client';
import { translations } from '@/_contents/translations';
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
import { Auth } from 'aws-amplify';
import { useCallback } from 'react';

interface ConfirmSignUpProps {
  email: string;
  onBack: () => null;
}

const ConfirmSignUp = ({ email, onBack }: ConfirmSignUpProps) => {
  const {
    auth: { confirmSignUp },
    shared,
  } = translations;

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
              {confirmSignUp.confirmSignUp}
            </Typography>
            <Typography
              variant='body2'
              mb={2}
              dangerouslySetInnerHTML={{
                __html: confirmSignUp.description(email),
              }}
            />
            <ResendEmail text={confirmSignUp.didntReceiveEmail} onResendClick={onResendEmail} />
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
                {confirmSignUp.wrongEmail}
              </Typography>
              <Link
                variant='body2'
                onClick={onBack}
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              >
                {shared.goBack}
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ConfirmSignUp;
