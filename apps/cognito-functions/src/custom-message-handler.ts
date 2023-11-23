import * as t from 'io-ts';
import { CustomMessageTriggerEvent } from 'aws-lambda';
import { makeConfirmationEmail } from './templates/confirmation-message';
import { makeConfirmationForgotPasswordEmail } from './templates/confirmation-forgot-password';

export const CustomMessageEnv = t.type({
  domain: t.string,
});
export type CustomMessageEnv = t.TypeOf<typeof CustomMessageEnv>;

export const makeHandler =
  (env: CustomMessageEnv) => async (event: CustomMessageTriggerEvent) => {
    const username = event.request.userAttributes['sub'];
    const cognitoUserStatus =
      event.request.userAttributes['cognito:user_status'];

    if (
      (event.triggerSource === 'CustomMessage_SignUp' ||
        event.triggerSource === 'CustomMessage_ResendCode') &&
      cognitoUserStatus === 'UNCONFIRMED'
    ) {
      const { codeParameter } = event.request;
      const href = `https://${env.domain}/auth/confirmation?username=${username}&code=${codeParameter}`;
      const emailMessage = makeConfirmationEmail(href, env.domain);
      const emailSubject = 'Verifica la tua e-mail per PagoPA DevPortal';
      const response = { ...event.response, emailMessage, emailSubject };
      return { ...event, response };
    } else if (event.triggerSource === 'CustomMessage_ForgotPassword') {
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
