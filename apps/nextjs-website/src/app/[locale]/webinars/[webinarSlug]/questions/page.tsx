import React from 'react';
import { getWebinar } from '@/lib/api';
import WebinarQuestionsTemplate from '@/components/templates/WebinarQuestionsTemplate/WebinarQuestionsTemplate';

type Params = {
  webinarSlug: string;
};

const WebinarQuestionsPage = async (props: { params: Promise<Params> }) => {
  const params = await props.params;
  const webinar = await getWebinar(params?.webinarSlug);

  return <WebinarQuestionsTemplate webinar={webinar} />;
};

export default WebinarQuestionsPage;
