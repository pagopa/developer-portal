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
  const response = await fetch(url, requestOptions).then((response) =>
    response.json()
  );
  if (response.status !== 'SUCCESS') {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to add question');
  }
  return true;
}
