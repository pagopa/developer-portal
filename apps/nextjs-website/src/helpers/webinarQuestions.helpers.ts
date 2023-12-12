import { webinarQuestionConfig } from '@/config';

type WebinarQuestion = {
  readonly email: string;
  readonly givenName: string;
  readonly familyName: string;
  readonly question: string;
  readonly webinarSlug: string;
  readonly date: string;
};

export async function addWebinarQuestion(params: WebinarQuestion) {
  const { url, resource } = webinarQuestionConfig;
  if (!url || !resource) {
    return { status: 'Missing configuration' };
  }
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'create',
      args: {
        resource,
        ...params,
      },
    }),
  };
  return await fetch(url, requestOptions).then((response) => response.json());
}
