import { webinarQuestionConfig } from '@/config';

export async function addWebinarQuestion(params: Record<string, string>) {
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
