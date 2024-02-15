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

interface ConfirmSignUpProps {
  email: string;
  onBack: () => null;
}

const ConfirmSignUp = ({ email, onBack }: ConfirmSignUpProps) => {
  const confirmSignUp = useTranslations('auth.confirmSignUp');
  const shared = useTranslations('shared');

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
            <Typography variant='body2' mb={2}>
              {confirmSignUp('emailSent')}
              <Box component='span' fontWeight='fontWeightMedium'>
                {email}
              </Box>
              <br />
              {confirmSignUp('clickToConfirm')}
            </Typography>
            <ResendEmail
              email={email}
              text={confirmSignUp('didntReceiveEmail')}
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
