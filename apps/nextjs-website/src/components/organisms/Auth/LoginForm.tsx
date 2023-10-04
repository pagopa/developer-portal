'use client';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { redirect } from 'next/navigation';

const LoginForm = () => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === 'authenticated') {
    redirect('/');
  }

  return (
    <Authenticator
      loginMechanisms={['email']}
      signUpAttributes={['given_name', 'family_name']}
    />
  );
};

export default LoginForm;
