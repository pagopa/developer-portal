import { VerifyAuthChallengeResponseTriggerEvent } from 'aws-lambda';

export const makeHandler =
  () =>
  async (
    event: VerifyAuthChallengeResponseTriggerEvent
  ): Promise<VerifyAuthChallengeResponseTriggerEvent> => {
    const { privateChallengeParameters, challengeAnswer } = event.request;
    // extract user correct answer
    const expectedAnswer = privateChallengeParameters.verificationCode;
    // check if the given answer match the expected one
    const answerCorrect = challengeAnswer === expectedAnswer;

    // return the result
    return { ...event, response: { answerCorrect } };
  };
