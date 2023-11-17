import { translations } from '@/_contents/translations';
import IconFireworks from '@/components/atoms/IconFireworks/IconFireworks';
import { Box, Typography, Stack, Grid, Button, Card } from '@mui/material';
import Link from 'next/link';

const PasswordChangedCard = () => {
  const {
    auth: { resetPassword },
  } = translations;

  return (
    <Box
      component='section'
      width={{ xs: '90vw', md: '60vw', lg: '35vw' }}
      marginY={{ xs: 12, md: 8, lg: 4 }}
    >
      <Card variant='outlined'>
        <Grid container justifyContent='center' padding={{ xs: 3, md: 4 }}>
          <Grid item>
            <Stack pt={4} display='flex' alignItems='center'>
              <IconFireworks />
            </Stack>
            <Typography variant='h4' pt={5} mb={4} textAlign='center'>
              {resetPassword.passwordSet}
            </Typography>
            <Stack spacing={4} pt={4} pb={4}>
              <Stack direction='row' justifyContent='center'>
                <Button variant='contained' component={Link} href='/auth/login'>
                  {resetPassword.goBackToLogin}
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default PasswordChangedCard;
