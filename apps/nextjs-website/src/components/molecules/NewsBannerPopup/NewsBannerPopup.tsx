import { Media } from '@/lib/media/types';
import { Box, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

export type NewsBannerPopupProps = {
  title?: string;
  description?: string;
  image?: Media;
  linkLabel?: string;
  linkUrl?: string;
};

const NewsBannerPopup = ({
  title,
  description,
  image,
  linkLabel,
  linkUrl,
}: NewsBannerPopupProps) => {
  const { palette } = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: palette.grey[50],
        borderRadius: '19px',
        mx: '106px',
        my: '64px',
        px: { xs: 3, md: '60px' },
        py: { xs: 4, md: '36px' },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ maxWidth: '576px' }}>
        <Typography
          variant='h4'
          fontWeight={700}
          color='text.primary'
          fontSize={'32px'}
          lineHeight={'42px'}
          letterSpacing={'0'}
        >
          {title}
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ whiteSpace: 'pre-line', lineHeight: 1.7, mb: 2.5 }}
        >
          {description}
        </Typography>
        <Link href={linkUrl || '#'}>{linkLabel}</Link>
      </Box>

      {image?.url && (
        <Box
          sx={{
            flexShrink: 0,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
            maxWidth: { xs: '100%', md: 300 },
          }}
        >
          <Box
            component='img'
            src={image.url}
            alt={image.alternativeText ?? title}
            sx={{
              display: 'block',
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default NewsBannerPopup;
