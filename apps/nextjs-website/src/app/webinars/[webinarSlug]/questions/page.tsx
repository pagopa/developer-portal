import React from 'react';
import { getWebinar } from '@/lib/api';
import WebinarQuestionsTemplate from '@/components/templates/WebinarQuestionsTemplate/WebinarQuestionsTemplate';

type Params = {
  webinarSlug: string;
};

const WebinarQuestionsPage = async ({
  params,
}: {
  params: Promise<Params>;
}) => {
  const resolvedParams = await params;
  const webinar = await getWebinar(resolvedParams?.webinarSlug);

  return <WebinarQuestionsTemplate webinar={webinar} />;
};

export default WebinarQuestionsPage;
