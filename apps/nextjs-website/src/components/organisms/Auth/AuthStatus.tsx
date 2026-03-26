'use client';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { redirect, useParams } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default function AuthStatus({ children }: PropsWithChildren) {
  const { locale } = useParams<{ locale: string }>();
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === 'authenticated') {
    redirect(`/${locale}`);
  }

  return children;
}
