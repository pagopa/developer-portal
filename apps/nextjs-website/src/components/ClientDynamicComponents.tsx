'use client';

import dynamic from 'next/dynamic';

export const NotSsrWebinarHeaderBanner = dynamic(
  () => import('@/components/atoms/WebinarHeaderBanner/WebinarHeaderBanner')
);

export const NotSsrWebinarsSection = dynamic(
  () => import('@/components/organisms/WebinarsSection/WebinarsSection')
);

export const NotSsrWebinarDetailTemplate = dynamic(
  () =>
    import(
      '@/components/templates/WebinarDetailTemplate/WebinarDetailTemplate'
    ),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);
