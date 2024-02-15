import {
  Box,
  Card,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { IllusEmailValidation } from '@pagopa/mui-italia';
import { useTranslations } from 'next-intl';

interface ResetPasswordSuccessProps {
  email: string;
  onBack: () => null;
  resendEmail: () => Promise<void>;
}

const ResetPasswordSuccess = ({
  email,
  onBack,
  resendEmail,
}: ResetPasswordSuccessProps) => {
  const resetPassword = useTranslations('auth.resetPassword');
  const shared = useTranslations('shared');

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
      <Card variant='elevation' elevation={8}>
        <Grid container justifyContent='center'>
          <Grid item xs={10}>
            <Stack pt={4} display='flex' alignItems='center'>
              <IllusEmailValidation />
            </Stack>
            <Typography variant='h4' pt={5} mb={4} textAlign='center'>
              {resetPassword('checkEmailTitle')}
            </Typography>
            <Typography variant='body1' mb={2}>
              {resetPassword('checkEmailStart')}
              <Box component='span' fontWeight='fontWeightMedium'>
                {email}
              </Box>
              <br />
              {resetPassword('checkEmailEnd')}
            </Typography>
            <Typography component='p' variant='caption' mb={4}>
              {resetPassword('resendEmailPrompt')}{' '}
              <Link
                onClick={resendEmail}
                underline='none'
                variant='caption-semibold'
                sx={{ cursor: 'pointer' }}
              >
                {resetPassword('resendEmail')}
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
                {resetPassword('wrongEmail')}
                {'  '}
                <Link
                  onClick={onBack}
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                >
                  {shared('goBack')}
                </Link>
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ResetPasswordSuccess;
