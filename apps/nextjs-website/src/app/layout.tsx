import { Metadata } from 'next';
import { baseUrl } from '@/config';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
