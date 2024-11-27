import { ListUsersCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { User } from '../types/user';

export function listUsersCommandOutputToUser(
  listUsersCommandOutput: ListUsersCommandOutput
) {
  const userData = listUsersCommandOutput.Users?.[0];
  if (!userData) {
    return undefined;
  }
  return {
    username: userData.Username,
    ...userData.Attributes?.reduce((acc, attr) => {
      if (!attr.Name || !attr.Value) {
        return acc;
      }
      acc[attr.Name] = attr.Value || '';
      return acc;
    }, {} as Record<string, string>),
  } as User;
}
