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

interface ConfirmSignUpProps {
  email: string;
  onResendEmail: () => Promise<null>;
  onBack: () => null;
}

const ConfirmSignUp = ({
  email,
  onBack,
  onResendEmail,
}: ConfirmSignUpProps) => {
  const {
    auth: { confirmSignUp },
    shared,
  } = translations;

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
            <Typography component='p' variant='caption' mb={4}>
              {confirmSignUp.didntReceiveEmail}{' '}
              <Link
                onClick={onResendEmail}
                underline='none'
                variant='caption-semibold'
                sx={{ cursor: 'pointer' }}
              >
                {confirmSignUp.resendEmail}
              </Link>
            </Typography>
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
