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
  Button,
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
      <Card variant='outlined' elevation={8}>
        <Grid container justifyContent='center'>
          <Grid item xs={11}>
            <Stack pt={4} display='flex' alignItems='center'>
              <IconInbox />
            </Stack>
            <Typography variant='h3' pt={5} mb={4} textAlign='center'>
              {confirmSignUp.confirmSignUp}
            </Typography>
            <Typography variant='body2' mb={2}>
              {confirmSignUp.description(email)}
            </Typography>
            <Typography component='p' variant='caption' mb={4}>
              {confirmSignUp.didntReceiveEmail}{' '}
              <Link
                href=''
                onClick={onResendEmail}
                underline='none'
                variant='caption-semibold'
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
                href=''
                variant='body2'
                onClick={onBack}
                sx={{ fontWeight: 600 }}
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
