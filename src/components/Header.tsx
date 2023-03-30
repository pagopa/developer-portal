import { Box, Container, Stack } from '@mui/material';
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import Link from 'next/link';

const values = {
  href: '/',
  title: 'PagoPA Developer Portal',
};

const Header = () => (
  <Stack
    justifyContent='center'
    sx={{
      borderBottom: 1,
      borderColor: theme.palette.grey[200],
      backgroundColor: 'background.paper',
      minHeight: '68px',
    }}
  >
    <Container maxWidth={false}>
      <Stack
        spacing={2}
        direction='row'
        justifyContent='space-between'
        alignItems='center'
      >
        <ButtonNaked
          size={'medium'}
          weight={'light'}
          component={Link}
          aria-label={values.title}
          href={values.href}
          title={values.title}
        >
          {'PagoPA'}
          <Box fontWeight={'bold'} sx={{ pl: 0.8, pr: 1.6 }}>
            {'Developer Portal'}
          </Box>
          <Box
            sx={{
              py: 0.2,
              px: 0.75,
              backgroundColor: theme.palette.text.primary,
              color: theme.palette.primary.contrastText,
              fontFamily: theme.typography.fontFamily,
              fontSize: 14,
              fontWeight: 400,
              borderRadius: theme.spacing(0.5),
            }}
          >
            {'BETA'}
          </Box>
        </ButtonNaked>
      </Stack>
    </Container>
  </Stack>
);

export default Header;
