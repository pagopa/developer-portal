import React from 'react';
import { getWebinar } from '@/lib/api';
import WebinarQuestionsTemplate from '@/components/templates/WebinarQuestionsTemplate/WebinarQuestionsTemplate';
import { notFound } from 'next/navigation';

type Params = {
  locale: string;
  webinarSlug: string;
};

const WebinarQuestionsPage = async (props: { params: Promise<Params> }) => {
  const { locale, webinarSlug } = await props.params;
  const webinar = await getWebinar(locale, webinarSlug);

  if (!webinar) {
    notFound();
  }

  return <WebinarQuestionsTemplate webinar={webinar} />;
};

export default WebinarQuestionsPage;
