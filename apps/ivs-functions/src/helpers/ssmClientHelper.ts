import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

export async function getParameter(
  paramName: string,
  ssmClient: SSMClient,
  fallbackValue?: string // Only for testing purposes
) {
  if (fallbackValue) {
    return fallbackValue;
  }
  const command = new GetParameterCommand({
    Name: paramName,
    WithDecryption: true,
  });
  const response = await ssmClient.send(command);

  return response.Parameter?.Value;
}
