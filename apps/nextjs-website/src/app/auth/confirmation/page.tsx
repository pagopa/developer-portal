'use client';

import { Auth } from 'aws-amplify';
import { useSearchParams } from 'next/navigation';

type ConfirmSignUpParameters = {
  username: string;
  code: string;
};

const confirmSignUp = async ({ username, code }: ConfirmSignUpParameters) => {
  // eslint-disable-next-line functional/no-try-statements
  try {
    await Auth.confirmSignUp(username, code);
  } catch (error) {
    console.log('error confirming sign up', error);
  }
};

const Page = async () => {
  const username = useSearchParams().get('username');
  const code = useSearchParams().get('code');
  if (username && code) await confirmSignUp({ username, code });
  return <div>{'Hello!'}</div>;
};

export default Page;
