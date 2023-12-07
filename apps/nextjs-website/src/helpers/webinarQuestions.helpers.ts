import { webinarQuestionConfig } from '@/config';

export async function addWebinarQuestion(params: Record<string, string>) {
  const { url, resource, token } = webinarQuestionConfig;
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      token,
      type: 'create',
      args: {
        resource,
        ...params,
      },
    }),
  };
  return await fetch(url, requestOptions).then((response) => response.json());
}
