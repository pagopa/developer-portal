import { PreSignUpTriggerEvent } from 'aws-lambda';
import * as E from 'fp-ts/Either';

export const makeHandler =
  (signUpAllowedEmailDomains: ReadonlyArray<string>) =>
  async (
    event: PreSignUpTriggerEvent
  ): Promise<E.Either<Error, PreSignUpTriggerEvent>> => {
    const email = event.request.userAttributes['email'];
    const domain = email.split('@')[1];

    // Validate the domain
    if (!signUpAllowedEmailDomains.includes(domain)) {
      return E.left(new Error('Invalid email domain'));
    }

    // Return the event wrapped in a right Either
    return E.right(event);
  };
