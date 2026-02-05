'use client';
import { Typography, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const PoliciesParagraph = () => {
  const { locale } = useParams<{ locale: string }>();
  const signUp = useTranslations('auth.signUp');
  const { palette } = useTheme();

  return (
    <Typography variant='body2'>
      {signUp.rich('acceptPolicy', {
        terms: (chunks) => (
          <Typography
            component={Link}
            fontSize={16}
            href={`/${locale}/terms-of-service`}
            variant='caption-semibold'
            color={palette.primary.main}
          >
            {chunks}
          </Typography>
        ),
        policy: (chunks) => (
          <Typography
            component={Link}
            fontSize={16}
            href={`/${locale}/privacy-policy`}
            variant='caption-semibold'
            color={palette.primary.main}
          >
            {chunks}
          </Typography>
        ),
      })}
    </Typography>
  );
};

export default PoliciesParagraph;
