import { webinarQuestionConfig } from '@/config';

type WebinarQuestion = {
  readonly email: string;
  readonly givenName: string;
  readonly familyName: string;
  readonly question: string;
  readonly webinarSlug: string;
  readonly date: string;
};

export async function addWebinarQuestion(
  params: WebinarQuestion
): Promise<void> {
  const { url, resource } = webinarQuestionConfig;
  if (!url || !resource) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Missing configuration');
  }
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'create',
      args: {
        resource,
        ...sanitizeParams(params),
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
}

function sanitizeParams(params: WebinarQuestion): WebinarQuestion {
  return {
    email: sanitize(params.email),
    givenName: sanitize(params.givenName),
    familyName: sanitize(params.familyName),
    question: sanitize(params.question),
    webinarSlug: sanitize(params.webinarSlug),
    date: sanitize(params.date),
  };
}

function sanitize(value: string): string {
  // remove any leading =
  return value.replace(/^=+/, '');
}
