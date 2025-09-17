import { CircularProgress, Link, Typography, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import { LoaderPhase } from '@/lib/types/loader';
import DoneIcon from '@mui/icons-material/Done';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Auth } from 'aws-amplify';
import { resetResendEmailAfterMs } from '@/config';

type ResendEmailProps = {
  text: string;
  email: string;
  isLoginCTA?: boolean;
  setSubmitting?: Dispatch<SetStateAction<boolean>>;
  resendCode?: () => Promise<boolean>;
};

const ResendEmail = ({
  text,
  email,
  setSubmitting,
  isLoginCTA = false,
  resendCode,
}: ResendEmailProps) => {
  const t = useTranslations('auth.resendEmail');
  const { palette } = useTheme();

  const [loader, setLoader] = useState<LoaderPhase | undefined>(undefined);

  const isLoading = loader === LoaderPhase.LOADING;

  const handleResendEmail = useCallback(async () => {
    setLoader(LoaderPhase.LOADING);

    const result =
      isLoginCTA && resendCode
        ? await resendCode()
        : await Auth.resendSignUp(email).catch(() => {
            setLoader(LoaderPhase.ERROR);
            return false;
          });

    if (result) {
      setLoader(LoaderPhase.SUCCESS);
      if (setSubmitting) {
        setSubmitting(false);
      }
    }

    setTimeout(() => {
      setLoader(undefined);
    }, resetResendEmailAfterMs);
  }, [email, isLoginCTA, resendCode, setSubmitting]);

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
        onClick={() => !isLoading && handleResendEmail()}
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
