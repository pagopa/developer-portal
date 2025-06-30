'use client';
import ErrorPage from '@/components/atoms/ErrorPage/ErrorPage';

export default function Error() {
  return (
    <ErrorPage
      overline={'genericError.overline'}
      title={'genericError.title'}
      description={'genericError.description'}
    />
  );
}
