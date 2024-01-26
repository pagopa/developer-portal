import React from 'react';
import { getWebinar, getWebinars } from '@/lib/api';
import dynamic from 'next/dynamic';
import Spinner from '@/components/atoms/Spinner/Spinner';

type Params = {
  webinarSlug: string;
};

export async function generateStaticParams() {
    const webinars = await getWebinars();
    return [...webinars].map(({ slug }) => ({
      webinarSlug: slug,
    }));
  }

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

  return (
   webinar && <NotSsrWebinarQuestionsTemplate webinar={webinar} />
  );
};

export default WebinarQuestionsPage;
