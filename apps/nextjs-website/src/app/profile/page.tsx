'use client';

import GuideMenu from '@/components/atoms/GuideMenu/GuideMenu';
import ProfileMenu from '@/components/atoms/ProfileMenu/ProfileMenu';
import { Box, useTheme, Typography, Stack, Card, Button } from '@mui/material';

const TermsOfService = () => {
  const { palette } = useTheme();
  return (
    <Box sx={{ display: 'flex' }}>
      <ProfileMenu name='Mario Rossi'></ProfileMenu>
      <Stack sx={{ margin: '30px' }}>
        <Typography variant='h3'>I tuoi dati</Typography>
        <Card elevation={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h6'>Profilo</Typography>
            <Button variant='outlined'>Modifica</Button>
          </Box>
        </Card>
      </Stack>
    </Box>
  );
};

export default TermsOfService;
