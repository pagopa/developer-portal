import { PreSignUpTriggerEvent } from 'aws-lambda';

export const makeHandler =
  (signUpAllowedEmailDomains: ReadonlyArray<string>) =>
  async (event: PreSignUpTriggerEvent): Promise<PreSignUpTriggerEvent> => {
    const email = event.request.userAttributes['email'];
    const domain = email.split('@')[1];

    // Check if the domain is allowed
    if (!signUpAllowedEmailDomains.includes(domain)) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('Invalid email domain');
    }

    // Return the event object as-is if the domain is valid
    return event;
  };
