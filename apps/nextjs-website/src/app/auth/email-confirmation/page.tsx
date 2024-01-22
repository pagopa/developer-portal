'use client';
import PageNotFound from '@/app/not-found';
import { Auth } from 'aws-amplify';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Spinner from '@/components/atoms/Spinner/Spinner';
import ExpiredCode from '@/app/auth/expired-code/page';

enum State {
  loading = 'loading',
  expiredCode = 'expiredCode',
  error = 'error',
}

const EmailConfirmation = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code');

  const [state, setState] = useState<State>(State.loading);

  useEffect(() => {
    if (code) {
      Auth.verifyCurrentUserAttributeSubmit('email', code)
        .then(() => {
          Auth.signOut();
          // eslint-disable-next-line functional/immutable-data
          router.push('/auth/account-activated');
        })
        .catch((error) => {
          switch (error.code) {
            case 'ExpiredCodeException':
              setState(State.expiredCode);
              break;
            case 'CodeMismatchException':
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

export default EmailConfirmation;
