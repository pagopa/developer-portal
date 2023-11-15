import { DefineAuthChallengeTriggerEvent } from 'aws-lambda';

export const makeHandler =
  () =>
  async (
    event: DefineAuthChallengeTriggerEvent
  ): Promise<DefineAuthChallengeTriggerEvent> => {
    const { session } = event.request;

    if (session.length === 1 && session[0].challengeName === 'SRP_A') {
      // SRP_A is the first challenge, this will be implemented by cognito. Set
      // next challenge as PASSWORD_VERIFIER.
      const response = {
        challengeName: 'PASSWORD_VERIFIER',
        failAuthentication: false,
        issueTokens: false,
      };
      return { ...event, response };
    } else if (
      session.length === 2 &&
      session[1].challengeName === 'PASSWORD_VERIFIER' &&
      session[1].challengeResult === true
    ) {
      // if password verification is successful then set next challenge as
      // CUSTOM_CHALLENGE.
      const response = {
        challengeName: 'CUSTOM_CHALLENGE',
        failAuthentication: false,
        issueTokens: false,
      };
      return { ...event, response };
    } else if (
      session.length === 3 &&
      session[2].challengeName === 'CUSTOM_CHALLENGE' &&
      session[2].challengeResult === true
    ) {
      // if MFA verification is successful then issue tokens
      const response = {
        challengeName: event.response.challengeName,
        failAuthentication: false,
        issueTokens: true,
      };
      return { ...event, response };
    } else {
      const response = {
        challengeName: event.response.challengeName,
        failAuthentication: true,
        issueTokens: false,
      };
      return { ...event, response };
    }
  };
