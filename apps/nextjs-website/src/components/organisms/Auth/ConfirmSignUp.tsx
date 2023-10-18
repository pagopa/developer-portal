'use client';
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
  onBack: () => void;
}

const ConfirmSignUp = ({ email, onBack }: ConfirmSignUpProps) => {
  return (
    <Box component='section'>
      <Card variant='outlined'>
        <Grid container justifyContent='center'>
          <Grid item xs={11}>
            <Stack pt={4} display='flex' alignItems='center'>
              <IconInbox />
            </Stack>
            <Typography variant='h3' pt={5} mb={4} textAlign='center'>
              Confermaci che sei tu
            </Typography>
            <Typography variant='body1' mb={2}>
              Abbiamo inviato una e-mail a <strong>{email}</strong> Clicca sul
              bottone contenuto al suo interno per verificarla.
            </Typography>
            <Typography variant='body1' mb={2}>
              Non hai ricevuto l&apos;e-mail? Controlla se nella posta
              indesiderata oppure <Button variant='text'>Reinvia e-mail</Button>
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
                L&apos;indirizzo email è errato?
              </Typography>
              <Button variant='text' onClick={onBack}>
                Torna indietro
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ConfirmSignUp;
