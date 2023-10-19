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
} from '@mui/material';

interface ConfirmSignUpProps {
  email: string;
  onBack: () => null;
}

const ConfirmSignUp = ({ email, onBack }: ConfirmSignUpProps) => {
  const {
    auth: { confirmSignUp },
    shared,
  } = translations;

  return (
    <Box component='section'>
      <Card variant='outlined'>
        <Grid container justifyContent='center'>
          <Grid item xs={11}>
            <Stack pt={4} display='flex' alignItems='center'>
              <IconInbox />
            </Stack>
            <Typography variant='h3' pt={5} mb={4} textAlign='center'>
              {confirmSignUp.confirmSignUp}
            </Typography>
            <Typography variant='body1' mb={2}>
              {confirmSignUp.description(email)}
            </Typography>
            <Typography variant='body1' mb={2}>
              <Button variant='text'>
                {confirmSignUp.didntReceiveEmail} {confirmSignUp.resendEmail}
              </Button>
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
              <Typography variant='caption-semibold' mr={1}>
                {confirmSignUp.wrongEmail}
              </Typography>
              <Button variant='text' onClick={onBack}>
                {shared.goBack}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ConfirmSignUp;
