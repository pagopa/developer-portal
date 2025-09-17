import { Box, Container, Typography } from '@mui/material';
import { type Generic } from '../../types/components';
import { isJSX } from '../../utils/index';

export interface LegalInfoProps {
  data?: string | Generic | Generic[];
}

export const LegalInfo = ({ data }: LegalInfoProps) => (
  <Box
    sx={{
      borderTop: 1,
      borderColor: 'divider',
      backgroundColor: 'background.paper',
    }}
  >
    <Container sx={{ px: 2, py: 2 }}>
      <Typography
        color='text.primary'
        variant='caption'
        textAlign='center'
        component={isJSX(data) ? 'div' : 'p'}
      >
        {data}
      </Typography>
    </Container>
  </Box>
);
