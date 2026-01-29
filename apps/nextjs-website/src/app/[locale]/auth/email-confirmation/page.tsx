'use client';
import PageNotFound from '@/app/[locale]/not-found';
import { Auth } from 'aws-amplify';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Spinner from '@/components/atoms/Spinner/Spinner';
import ExpiredCode from '@/app/[locale]/auth/expired-code/page';

enum State {
  loading = 'loading',
  expiredCode = 'expiredCode',
  error = 'error',
}

const EmailConfirmationContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code');

  const [state, setState] = useState<State>(State.loading);

  useEffect(() => {
    if (code) {
      Auth.verifyCurrentUserAttributeSubmit('email', code)
        .then(() => {
          // eslint-disable-next-line functional/immutable-data
          router.push('/auth/account-activated');
          Auth.signOut();
        })
        .catch((error) => {
          switch (error.code) {
            case 'ExpiredCodeException':
              setState(State.expiredCode);
              break;
            case 'CodeMismatchException':
            case 'InternalErrorException':
            case 'LimitExceededException':
            default:
              setState(State.error);
              break;
          }
        });
    } else {
      setState(State.error);
    }
  }, [code, router]);

  switch (state) {
    case State.error:
      return <PageNotFound />;
    case State.expiredCode:
      return <ExpiredCode />;
    default:
      return <Spinner />;
  }
};

const EmailConfirmation = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <EmailConfirmationContent />
    </Suspense>
  );
};

export default EmailConfirmation;
