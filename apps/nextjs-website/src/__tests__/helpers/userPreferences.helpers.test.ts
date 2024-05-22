import {
  mergeUserPreferencesToAttributes,
  userPreferencesFromAttributes,
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
