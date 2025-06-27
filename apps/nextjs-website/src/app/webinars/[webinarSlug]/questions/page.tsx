import React from 'react';
import { getWebinar } from '@/lib/api';
import WebinarQuestionsTemplate from '@/components/templates/WebinarQuestionsTemplate/WebinarQuestionsTemplate';
import { getWebinarsProps } from '@/lib/cmsApi';

type Params = {
  webinarSlug: string;
};

// export async function generateStaticParams() {
//   const webinars = await getWebinarsProps();
//   return [...webinars].map(({ slug }) => ({
//     webinarSlug: slug,
//   }));
// }

const WebinarQuestionsPage = async ({ params }: { params: Params }) => {
  const webinar = await getWebinar(params?.webinarSlug);

  return <WebinarQuestionsTemplate webinar={webinar} />;
};

export default WebinarQuestionsPage;
