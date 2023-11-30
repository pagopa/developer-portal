import { CircularProgress, Link, Typography, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import { LoaderPhase } from '@/lib/types/loader';
import DoneIcon from '@mui/icons-material/Done';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useCallback, useState } from 'react';
import { resetResendEmailAfterMs } from '@/config';

type ResendEmailProps = {
  text: string;

  onResendClick: () => Promise<boolean>;
};

const ResendEmail = ({ text, onResendClick }: ResendEmailProps) => {
  const t = useTranslations('auth.resendEmail');
  const { palette } = useTheme();

  const [loader, setLoader] = useState<LoaderPhase | undefined>(undefined);

  const isLoading = loader === LoaderPhase.LOADING;

  const handleClick = useCallback(async () => {
    setLoader(LoaderPhase.LOADING);

    const result = await onResendClick().catch(() => {
      setLoader(LoaderPhase.ERROR);
      return false;
    });

    if (result) {
      setLoader(LoaderPhase.SUCCESS);
    }

    setTimeout(() => {
      setLoader(undefined);
    }, resetResendEmailAfterMs);
  }, [onResendClick]);

  const buildLoader = () => {
    switch (loader) {
      case LoaderPhase.LOADING:
        return (
          <CircularProgress size={14} sx={{ ml: 0.5, fontSize: 'inherit' }} />
        );
      case LoaderPhase.SUCCESS:
        return <DoneIcon sx={{ ml: 0.5, fontSize: 'small' }} />;
      case LoaderPhase.ERROR:
        return <ErrorOutlineIcon sx={{ ml: 0.5, fontSize: 'small' }} />;
      default:
        return null;
    }
  };

  return (
    <Typography
      component='p'
      variant='caption'
      mb={4}
      sx={{ color: palette.text.secondary }}
    >
      {text}{' '}
      <Link
        onClick={handleClick}
        underline='none'
        variant='caption-semibold'
        sx={{ cursor: isLoading ? 'unset' : 'pointer' }}
      >
        {t('label')}
        {buildLoader()}
      </Link>
    </Typography>
  );
};

export default ResendEmail;
