import {
  MAX_USER_PREFERENCES_LENGTH,
  addWebinarSubscriptionToAttributes,
  mergeUserPreferencesToAttributes,
  removeWebinarSubscriptionToAttributes,
  userPreferencesFromAttributes,
  webinarSubscriptionExists,
} from '../../helpers/userPreferences.helpers';
import { DevPortalUser, UserPreferences } from '@/lib/types/auth';

const existingSlugs = ['webinar-1', 'webinar-2'];

const userPreferences: UserPreferences = {
  subscribedWebinarSlugs: existingSlugs,
};

const attributesWithoutUserPreferences: DevPortalUser['attributes'] = {
  email: 'user@mail.com',
  email_verified: true,
  family_name: 'Family Name',
  given_name: 'Given Name',
  sub: 'string',
  'custom:company_type': 'ente-pubblico',
  'custom:job_role': 'developer',
  'custom:mailinglist_accepted': 'true',
  'custom:privacy_accepted': true,
};

const attributes: DevPortalUser['attributes'] = {
  ...attributesWithoutUserPreferences,
  'custom:user_preferences': JSON.stringify(userPreferences),
};

it('should extract UserPreference from user', () => {
  expect(userPreferencesFromAttributes(attributes)).toEqual(userPreferences);
});

it('should extract UserPreference from user with incosistent state', () => {
  const expectedUserPreferences: UserPreferences = {
    subscribedWebinarSlugs: [],
  };
  expect(
    userPreferencesFromAttributes({
      ...attributesWithoutUserPreferences,
      'custom:user_preferences': 'dsdsdfds',
    })
  ).toEqual(expectedUserPreferences);
  expect(
    userPreferencesFromAttributes({
      ...attributesWithoutUserPreferences,
      'custom:user_preferences': undefined,
    })
  ).toEqual(expectedUserPreferences);
  expect(
    userPreferencesFromAttributes({
      ...attributesWithoutUserPreferences,
      'custom:user_preferences': (12345).toString(),
    })
  ).toEqual(expectedUserPreferences);
});

it('should remove null value from UserPreference', () => {
  const expectedUserPreferences: UserPreferences = {
    subscribedWebinarSlugs: [],
  };
  expect(
    userPreferencesFromAttributes({
      ...attributesWithoutUserPreferences,
      'custom:user_preferences': `{"subscribedWebinarSlugs":[null]}`,
    })
  ).toEqual(expectedUserPreferences);
});

it('should covert UserPreference to attributes', () => {
  const userPreferences: UserPreferences = {
    subscribedWebinarSlugs: ['test', 'test2'],
  };
  const newAttributes = {
    ...attributes,
    'custom:user_preferences': JSON.stringify(userPreferences),
  };
  expect(mergeUserPreferencesToAttributes(userPreferences, attributes)).toEqual(
    newAttributes
  );
});

it('should add new webinar subscription to attributes', () => {
  const newWebinarSlug = 'webinar-3';
  const newAttributes = {
    ...attributes,
    'custom:user_preferences': JSON.stringify({
      subscribedWebinarSlugs: [...existingSlugs, newWebinarSlug],
    }),
  };

  expect(
    addWebinarSubscriptionToAttributes(newWebinarSlug, attributes)
  ).toEqual(newAttributes);
});

it('should not add existing webinar subscription to attributes', () => {
  expect(
    addWebinarSubscriptionToAttributes(existingSlugs[0], attributes)
  ).toEqual(attributes);
});

it('should not add new webinar if UserPreferences execed char limits', () => {
  const newWebinarSlug =
    'webinar-' + [...Array(MAX_USER_PREFERENCES_LENGTH).keys()].join('');

  expect(
    addWebinarSubscriptionToAttributes(newWebinarSlug, attributes)
  ).toEqual(
    new Error(`User preferences length execed ${MAX_USER_PREFERENCES_LENGTH}`)
  );
});

it('should create subscribedWebinarSlugs and add existing webinar subscription to attributes', () => {
  const newWebinarSlug = 'webinar-3';
  const newAttributes = {
    ...attributesWithoutUserPreferences,
    'custom:user_preferences': JSON.stringify({
      subscribedWebinarSlugs: [newWebinarSlug],
    }),
  };
  expect(
    addWebinarSubscriptionToAttributes(
      newWebinarSlug,
      attributesWithoutUserPreferences
    )
  ).toEqual(newAttributes);
});

it('should remove existing webinar subscription to attributes', () => {
  const newAttributes = {
    ...attributes,
    'custom:user_preferences': JSON.stringify({
      subscribedWebinarSlugs: [existingSlugs[1]],
    }),
  };

  expect(
    removeWebinarSubscriptionToAttributes(existingSlugs[0], attributes)
  ).toEqual(newAttributes);
});

it('should return true if webinar subscription exists', () => {
  expect(webinarSubscriptionExists(existingSlugs[0], attributes)).toEqual(true);
});

it('should return false if webinar subscription does not exist', () => {
  expect(webinarSubscriptionExists('new-slug', attributes)).toEqual(false);
});
