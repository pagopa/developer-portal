'use client';

import { Box, Button, Card, Stack, Typography, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const TermsOfService = () => {
  const { palette } = useTheme();
  return (
    <Stack sx={{ margin: '30px', width: '100%' }}>
      <Typography variant='h3'>I tuoi dati</Typography>
      <Card raised sx={{ padding: 2, marginTop: 6, maxWidth: '700px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h6' sx={{ paddingTop: '8px' }}>
            Profilo
          </Typography>
          <Button variant='text' endIcon={<EditIcon sx={{ height: 30 }} />}>
            Modifica
          </Button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            borderBottom: '1px solid ' + palette.background.default,
            paddingBottom: '20px',
            paddingTop: '16px',
          }}
        >
          <Typography sx={{ paddingTop: '8px', minWidth: '200px' }}>
            Nome
          </Typography>
          <Typography sx={{ paddingTop: '8px', flexGrow: 1, fontWeight: 700 }}>
            Mario
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            borderBottom: '1px solid ' + palette.background.default,
            paddingBottom: '20px',
            paddingTop: '16px',
          }}
        >
          <Typography sx={{ paddingTop: '8px', minWidth: '200px' }}>
            Cognome
          </Typography>
          <Typography sx={{ paddingTop: '8px', flexGrow: 1, fontWeight: 700 }}>
            Rossi
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            borderBottom: '1px solid ' + palette.background.default,
            paddingBottom: '20px',
            paddingTop: '16px',
          }}
        >
          <Typography sx={{ paddingTop: '8px', minWidth: '200px' }}>
            Ruolo
          </Typography>
          <Typography sx={{ paddingTop: '8px', flexGrow: 1, fontWeight: 700 }}>
            Backend engineer
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            borderBottom: '1px solid ' + palette.background.default,
            paddingBottom: '20px',
            paddingTop: '16px',
          }}
        >
          <Typography sx={{ paddingTop: '8px', minWidth: '200px' }}>
            Settore
          </Typography>
          <Typography sx={{ paddingTop: '8px', flexGrow: 1, fontWeight: 700 }}>
            Pagamenti
          </Typography>
        </Box>
        <Box
          sx={{ display: 'flex', paddingBottom: '20px', paddingTop: '16px' }}
        >
          <Typography sx={{ paddingTop: '8px', minWidth: '200px' }}>
            Prodotti di interesse
          </Typography>
          <Typography sx={{ paddingTop: '8px', flexGrow: 1, fontWeight: 700 }}>
            Firma con IO, App IO, Piattaforma PagoPA
          </Typography>
        </Box>
      </Card>

      <Card raised sx={{ padding: 2, marginTop: 6, maxWidth: '700px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h6' sx={{ paddingTop: '8px' }}>
            Account
          </Typography>
          <Button variant='text' endIcon={<EditIcon sx={{ height: 30 }} />}>
            Modifica
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            borderBottom: '1px solid ' + palette.background.default,
            paddingBottom: '20px',
            paddingTop: '16px',
          }}
        >
          <Typography sx={{ paddingTop: '8px', minWidth: '200px' }}>
            Indirizzo e-mail
          </Typography>
          <Typography sx={{ paddingTop: '8px', flexGrow: 1, fontWeight: 700 }}>
            mario.rossi@cineca.com
          </Typography>
        </Box>
        <Box
          sx={{ display: 'flex', paddingBottom: '20px', paddingTop: '16px' }}
        >
          <Typography sx={{ paddingTop: '8px', minWidth: '200px' }}>
            Password
          </Typography>
          <Typography sx={{ paddingTop: '8px', flexGrow: 1, fontWeight: 700 }}>
            ••••••••••••
          </Typography>
        </Box>
      </Card>
    </Stack>
  );
};

export default TermsOfService;
