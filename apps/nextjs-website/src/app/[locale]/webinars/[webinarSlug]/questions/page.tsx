import React from 'react';
import { getWebinar } from '@/lib/api';
import WebinarQuestionsTemplate from '@/components/templates/WebinarQuestionsTemplate/WebinarQuestionsTemplate';

type Params = {
  locale: string;
  webinarSlug: string;
};

const WebinarQuestionsPage = async (props: { params: Promise<Params> }) => {
  const { locale, webinarSlug } = await props.params;
  const webinar = await getWebinar(locale, webinarSlug);

  return <WebinarQuestionsTemplate webinar={webinar} />;
};

export default WebinarQuestionsPage;
