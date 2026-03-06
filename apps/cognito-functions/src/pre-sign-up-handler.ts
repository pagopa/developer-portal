import { PreSignUpTriggerEvent } from 'aws-lambda';

const emailMatcher = /^[a-z0-9-._+]+@([a-z0-9-]+\.)+[a-z]{2,4}$/;
const nameMatcher = /^(?=.{1,50}$)[A-Za-z0-9]+(?:[ _'-]?[A-Za-z0-9]+)*$/;

export const makeHandler =
  (signUpAllowedEmailDomains: ReadonlyArray<string>) =>
  async (event: PreSignUpTriggerEvent): Promise<PreSignUpTriggerEvent> => {
    const email = event.request.userAttributes['email'].toLowerCase().trim();
    const domain = email.split('@')[1];

    // Check if the domain is allowed
    if (!signUpAllowedEmailDomains.includes(domain)) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('Invalid email domain');
    }

    if (!email || !emailMatcher.test(email)) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('Invalid email format');
    }

    const givenName = event.request.userAttributes['given_name'];
    const familyName = event.request.userAttributes['family_name'];
    const role = event.request.userAttributes['custom:job_role'];

    if (!givenName || !nameMatcher.test(givenName.trim())) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('Invalid given name');
    }

    if (!familyName || !nameMatcher.test(familyName.trim())) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('Invalid family name');
    }

    if (role && !nameMatcher.test(role.trim())) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('Invalid role');
    }

    // Return the event object as-is if the domain is valid
    return event;
  };
