import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import { Box, Container, Stack, Typography, useTheme } from '@mui/material';
import { BannerLinkProps } from '@pagopa/pagopa-editorial-components/dist/components/BannerLink';

export const BannerLink = (props: BannerLinkProps) => {
  const { theme, body, title, decoration } = props;
  const { palette, spacing } = useTheme();

  const backgroundColor =
    theme === 'dark' ? palette.primary.dark : palette.primary.light;

  const textColor = palette.primary.contrastText;
  return (
    <Box component='section' sx={{ width: '100%' }}>
      <Container>
        <Stack gap={4} sx={styles.main}>
          <IconWrapper icon={decoration} color={textColor} size={60} />
          <Stack textAlign='center' gap={spacing(2)}>
            <Typography color={textColor} variant='h6'>
              {title}
            </Typography>
            <Typography color={textColor} variant='body2' component='div'>
              <div dangerouslySetInnerHTML={{ __html: body }} />
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
    padding: { md: '64px 80px', xs: '32px 24px' },
  },
};
