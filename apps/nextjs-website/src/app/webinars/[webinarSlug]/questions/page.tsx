import React from 'react';
import { getWebinar, getWebinars } from '@/lib/api';
import WebinarQuestionsTemplate from '@/components/organisms/WebinarQuestionsTemplate/WebinarQuestionsTemplate';

type Params = {
  webinarSlug: string;
};

export async function generateStaticParams() {
  const webinars = await getWebinars();
  return [...webinars].map(({ slug }) => ({
    webinarSlug: slug,
  }));
}

const WebinarQuestionsPage = async ({ params }: { params: Params }) => {
  const webinar = await getWebinar(params?.webinarSlug);

  return <WebinarQuestionsTemplate webinar={webinar} />;
};

export default WebinarQuestionsPage;
