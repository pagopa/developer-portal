import { PreSignUpTriggerEvent } from 'aws-lambda';

export const makeHandler =
  (signUpAllowedEmailDomains: Array<string>) =>
    async (
      event: PreSignUpTriggerEvent
    ): Promise<PreSignUpTriggerEvent> => {
      const email = event.request.userAttributes['email'];
      const domain = email.split('@')[1];

      if (!signUpAllowedEmailDomains.includes(domain)) {
        throw new Error('Invalid email domain');
      }

      // return the result
      return event;
    };
