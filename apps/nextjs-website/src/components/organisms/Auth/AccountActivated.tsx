'use client';
import { translations } from '@/_contents/translations';
import IconFireworks from '@/components/atoms/IconFireworks/IconFireworks';
import { Box, Typography, Stack, Grid, Button, Card } from '@mui/material';
import Link from 'next/link';

const AccountActivated = () => {
  const {
    auth: { activatedAccount },
  } = translations;

  return (
    <Box component='section' width='35vw'>
      <Card variant='outlined'>
        <Grid container justifyContent='center'>
          <Grid item xs={11}>
            <Stack pt={4} display='flex' alignItems='center'>
              <IconFireworks />
            </Stack>
            <Typography variant='h3' pt={5} mb={4} textAlign='center'>
              {activatedAccount.accountActivated}
            </Typography>
            <Typography variant='body1' mb={2} textAlign='center'>
              {activatedAccount.description}
            </Typography>
            <Stack spacing={4} pt={4} pb={8}>
              <Stack direction='row' justifyContent='center'>
                <Link href='/'>
                  <Button variant='contained'>
                    {activatedAccount.goToProfile}
                  </Button>
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
