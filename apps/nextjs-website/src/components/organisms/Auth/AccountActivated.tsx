'use client';
import IconFireworks from '@/components/atoms/IconFireworks/IconFireworks';
import { Box, Typography, Stack, Grid, Button, Card } from '@mui/material';
import Link from 'next/link';

const AccountActivated = () => {
  return (
    <Box component='section' width='35vw'>
      <Card variant='outlined'>
        <Grid container justifyContent='center'>
          <Grid item xs={11}>
            <Stack pt={4} display='flex' alignItems='center'>
              <IconFireworks />
            </Stack>
            <Typography variant='h3' pt={5} mb={4} textAlign='center'>
              Il tuo account è attivo
            </Typography>
            <Typography variant='body1' mb={2} textAlign='center'>
              Ti diamo il benvenuto su PagoPA DevPortal. <br />
              Puoi iniziare da subito a personalizzare la tua Dashboard.
            </Typography>
            <Stack spacing={4} pt={4} pb={8}>
              <Stack direction='row' justifyContent='center'>
                <Link href='/'>
                  <Button variant='contained'>Vai al tuo profilo</Button>
                </Link>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default AccountActivated;
