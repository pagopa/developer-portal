'use client';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default function AuthStatus({ children }: PropsWithChildren) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === 'authenticated') {
    redirect('/');
  }

  return children;
}
