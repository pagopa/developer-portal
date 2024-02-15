import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import { Box, Container, Stack, Typography, useTheme } from '@mui/material';
import { type CommonProps } from '@/editorialComponents/types/components';
import { CtaProps } from '@/editorialComponents/Ctas/Ctas';
import { BannerLinkContentProps } from '@/editorialComponents/BannerLink/Content';
import DOMPurify from 'isomorphic-dompurify';

export interface BannerLinkProps
  extends CommonProps,
    BannerLinkContentProps,
    CtaProps {
  decoration: string;
}

export const BannerLink = (props: BannerLinkProps) => {
  const { theme, body, title, decoration } = props;
  const { palette, spacing } = useTheme();

  const backgroundColor =
    theme === 'dark' ? palette.primary.dark : palette.primary.light;

  const bodyElement = typeof body === 'string' ? <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }} /> : body;

  const textColor = palette.primary.contrastText;
  return (
    <Box bgcolor={backgroundColor} component='section' sx={{ width: '100%' }}>
      <Container>
        <Stack gap={4} sx={styles.main}>
          <IconWrapper icon={decoration} color={textColor} size={60} />
          <Stack textAlign='center' gap={spacing(2)}>
            <Typography color={textColor} variant='h6'>
              {title}
            </Typography>
            <Typography
              color={textColor}
              variant='body2'
              component='div'
              sx={{
                'div > a': {
                  color: textColor,
                  fontWeight: 700,
                  textDecoration: 'none',
                },
              }}
            >
              {bodyElement}
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
