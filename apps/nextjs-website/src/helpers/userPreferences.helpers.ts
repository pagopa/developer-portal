import { DevPortalUser, UserPreferences } from '@/lib/types/auth';

export const MAX_USER_PREFERENCES_LENGTH = 2048;

const DEFAULT_USER_PREFERENCES: UserPreferences = {
  subscribedWebinarSlugs: [],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isUserPreferences(obj: any): obj is UserPreferences {
  return obj?.subscribedWebinarSlugs !== undefined;
}

export function userPreferencesFromAttributes(
  attributes: DevPortalUser['attributes']
): UserPreferences {
  // eslint-disable-next-line functional/no-try-statements
  try {
    const userPreferencesString = attributes['custom:user_preferences'];
    const userPreferences = userPreferencesString
      ? JSON.parse(userPreferencesString)
      : DEFAULT_USER_PREFERENCES;
    const userPreferencesParsed = isUserPreferences(userPreferences)
      ? (userPreferences as UserPreferences)
      : DEFAULT_USER_PREFERENCES;
    return {
      ...userPreferencesParsed,
      subscribedWebinarSlugs:
        userPreferencesParsed.subscribedWebinarSlugs.filter(Boolean),
    };
  } catch {
    return DEFAULT_USER_PREFERENCES;
  }
}

export function mergeUserPreferencesToAttributes(
  userPreferences: UserPreferences,
  attributes: DevPortalUser['attributes']
): DevPortalUser['attributes'] | Error {
  const userPreferencesToString = JSON.stringify(userPreferences);
  if (userPreferencesToString.length > MAX_USER_PREFERENCES_LENGTH) {
    return new Error(
      `User preferences length execed ${MAX_USER_PREFERENCES_LENGTH}`
    );
  }
  return {
    ...attributes,
    'custom:user_preferences': userPreferencesToString,
  };
}
