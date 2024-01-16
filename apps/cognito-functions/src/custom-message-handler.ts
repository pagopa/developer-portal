import * as t from 'io-ts';
import { CustomMessageTriggerEvent } from 'aws-lambda';
import { makeConfirmationEmail } from './templates/confirmation-message';
import { makeConfirmationForgotPasswordEmail } from './templates/confirmation-forgot-password';
import { makeConfirmationUpdateEmailAddress } from './templates/confirmation-update-email-address';

export const CustomMessageEnv = t.type({
  domain: t.string,
});
export type CustomMessageEnv = t.TypeOf<typeof CustomMessageEnv>;

export const makeHandler =
  (env: CustomMessageEnv) => async (event: CustomMessageTriggerEvent) => {
    const username = event.request.userAttributes['sub'];
    const cognitoUserStatus =
      event.request.userAttributes['cognito:user_status'];
    const eventTrigger = event.triggerSource;

    if (
      eventTrigger === 'CustomMessage_SignUp' ||
      eventTrigger === 'CustomMessage_ResendCode'
    ) {
      if (cognitoUserStatus === 'CONFIRMED') {
        // eslint-disable-next-line functional/no-expression-statements
        console.log(
          `User ${username} is confirmed and has requested to resend the email`
        );
        // eslint-disable-next-line functional/no-throw-statements
        throw new Error('Operation not permitted');
      }
      const { codeParameter } = event.request;
      const href = `https://${env.domain}/auth/confirmation?username=${username}&code=${codeParameter}`;
      const emailMessage = makeConfirmationEmail(href, env.domain);
      const emailSubject = 'Verifica la tua e-mail per PagoPA DevPortal';
      const response = { ...event.response, emailMessage, emailSubject };
      return { ...event, response };
    } else if (eventTrigger === 'CustomMessage_ForgotPassword') {
      const { codeParameter } = event.request;
      const href = `https://${env.domain}/auth/change-password?username=${username}&code=${codeParameter}`;
      const emailMessage = makeConfirmationForgotPasswordEmail(
        href,
        env.domain
      );
      const emailSubject = 'Password dimenticata';
      const response = { ...event.response, emailMessage, emailSubject };
      return { ...event, response };
    } else {
      return event;
    }
  };
