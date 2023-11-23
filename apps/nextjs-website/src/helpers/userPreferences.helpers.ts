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
    return isUserPreferences(userPreferences)
      ? (userPreferences as UserPreferences)
      : DEFAULT_USER_PREFERENCES;
  } catch (error) {
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

export function addWebinarSubscriptionToAttributes(
  slug: string,
  attributes: DevPortalUser['attributes']
): DevPortalUser['attributes'] | Error {
  const currentUserPreferences = userPreferencesFromAttributes(attributes);
  if (!currentUserPreferences.subscribedWebinarSlugs) {
    return mergeUserPreferencesToAttributes(
      {
        subscribedWebinarSlugs: [slug],
      },
      attributes
    );
  } else if (
    !!currentUserPreferences.subscribedWebinarSlugs &&
    !currentUserPreferences.subscribedWebinarSlugs.includes(slug)
  ) {
    return mergeUserPreferencesToAttributes(
      {
        subscribedWebinarSlugs: [
          ...currentUserPreferences.subscribedWebinarSlugs,
          slug,
        ],
      },
      attributes
    );
  } else {
    return attributes;
  }
}

export function removeWebinarSubscriptionToAttributes(
  slug: string,
  attributes: DevPortalUser['attributes']
): DevPortalUser['attributes'] | Error {
  const currentUserPreferences = userPreferencesFromAttributes(attributes);
  if (
    !!currentUserPreferences.subscribedWebinarSlugs &&
    currentUserPreferences.subscribedWebinarSlugs.includes(slug)
  ) {
    return mergeUserPreferencesToAttributes(
      {
        subscribedWebinarSlugs:
          currentUserPreferences.subscribedWebinarSlugs.filter(
            (subscriptionSlug) => subscriptionSlug !== slug
          ),
      },
      attributes
    );
  } else {
    return attributes;
  }
}
