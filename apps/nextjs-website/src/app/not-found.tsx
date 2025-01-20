'use client';
import ErrorPage from '@/components/atoms/ErrorPage/ErrorPage';

export default function PageNotFound() {
  return (
    <ErrorPage
      overline={'pageNotFound.overline'}
      title={'pageNotFound.title'}
      description={'pageNotFound.description'}
    />
  );
}
