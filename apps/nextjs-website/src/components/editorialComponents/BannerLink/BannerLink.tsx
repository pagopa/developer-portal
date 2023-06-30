import { getIconFromIconName } from '@/helpers/getIconFromName';
import { Box, Container, Stack, Typography, useTheme } from '@mui/material';

import { BannerLinkProps } from '@pagopa/pagopa-editorial-components/dist/components/BannerLink';

export const BannerLink = (props: BannerLinkProps) => {
  const { theme, body, title, decoration } = props;
  const { palette, spacing } = useTheme();

  const backgroundColor =
    theme === 'dark' ? palette.primary.dark : palette.primary.light;

  const textColor = palette.primary.contrastText;
  return (
    <Box bgcolor={backgroundColor} component='section' sx={{ width: '100%' }}>
      <Container>
        <Stack gap={4} sx={styles.main}>
          {getIconFromIconName(decoration, textColor)}
          <Stack textAlign='center' gap={spacing(2)}>
            <Typography color={textColor} variant='h6'>
              {title}
            </Typography>
            <Typography color={textColor} variant='body2'>
              {body}
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

const styles = {
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: { md: '64px 142px', xs: '32px 24px' },
  },
};
