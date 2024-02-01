import React from 'react';
import { getWebinar } from '@/lib/api';
import dynamic from 'next/dynamic';
import Spinner from '@/components/atoms/Spinner/Spinner';

type Params = {
  webinarSlug: string;
};

const NotSsrWebinarQuestionsTemplate = dynamic(
  () =>
    import(
      '@/components/organisms/WebinarQuestionsTemplate/WebinarQuestionsTemplate'
    ),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

const WebinarQuestionsPage = async ({ params }: { params: Params }) => {
  const webinar = await getWebinar(params?.webinarSlug);

  return <NotSsrWebinarQuestionsTemplate webinar={webinar} />;
};

export default WebinarQuestionsPage;
