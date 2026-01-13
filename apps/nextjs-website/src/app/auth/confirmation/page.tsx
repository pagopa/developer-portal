'use client';
import { Button } from '@mui/material';
import PageNotFound from '@/app/not-found';
import { Auth } from 'aws-amplify';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, Suspense } from 'react';
import Spinner from '@/components/atoms/Spinner/Spinner';
import { useTranslations } from 'next-intl';
import PageBackgroundWrapper from '@/components/atoms/PageBackgroundWrapper/PageBackgroundWrapper';
import SingleCard from '@/components/atoms/SingleCard/SingleCard';
import { isProduction } from '@/config';
import { ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import AccountAlreadyConfirmed from '@/components/organisms/Auth/AccountAlreadyConfirmed';

enum State {
  loading = 'loading',
  resendCode = 'resendCode',
  alreadyConfirmed = 'alreadyConfirmed',
  error = 'error',
}

const ConfirmationContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = searchParams.get('username');
  const code = searchParams.get('code');
  const t = useTranslations('auth');

  const [submitting, setSubmitting] = useState(false);
  const [state, setState] = useState<State>(State.loading);

  useEffect(() => {
    if (username && code) {
      Auth.confirmSignUp(username, code)
        .then(() => {
          // eslint-disable-next-line functional/immutable-data
          router.push('/auth/account-activated');
        })
        .catch((error) => {
          // TODO: remove console warn and handle errors: [CodeMismatchException, ExpiredCodeException, InternalErrorException, LimitExceededException]
          // see apps/nextjs-website/src/app/auth/email-confirmation/page.tsx
          if (!isProduction) {
            console.warn(error);
          }
          switch (error.code) {
            case 'AliasExistsException':
              setState(State.alreadyConfirmed);
              break;
            case 'LimitExceededException':
              setState(State.error);
              break;
            default:
              setState(State.resendCode);
          }
        });
    } else {
      setState(State.error);
    }
  }, [username, code, router]);

  const onResendEmail = useCallback(async () => {
    setSubmitting(true);
    if (!username) {
      setState(State.error);
      return;
    }

    await Auth.resendSignUp(username).catch(() => {
      setState(State.error);
      return false;
    });

    setSubmitting(false);
  }, [username]);

  switch (state) {
    case State.error:
      return <PageNotFound />;
    case State.alreadyConfirmed:
      return <AccountAlreadyConfirmed />;
    case State.resendCode:
      return (
        <PageBackgroundWrapper>
          <SingleCard
            icon={
              <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main' }} />
            }
            title={t('confirmation.title')}
            cta={
              <Button
                disabled={submitting}
                variant='contained'
                onClick={onResendEmail}
              >
                {t('confirmation.ctaLabel')}
              </Button>
            }
          />
        </PageBackgroundWrapper>
      );
    default:
      return <Spinner />;
  }
};

const Confirmation = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <ConfirmationContent />
    </Suspense>
  );
};

export default Confirmation;
