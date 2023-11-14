import * as t from 'io-ts';
import { CustomMessageForgotPasswordTriggerEvent } from 'aws-lambda';
import { makeConfirmationForgotPasswordEmail } from './templates/confirmation-message-forgot-password';

export const CustomMessageForgotPasswordEnv = t.type({
  domain: t.string,
});
export type CustomMessageForgotPasswordEnv = t.TypeOf<
  typeof CustomMessageForgotPasswordEnv
>;

export const makeHandler =
  (env: CustomMessageForgotPasswordEnv) =>
  async (event: CustomMessageForgotPasswordTriggerEvent) => {
    const username = event.request.userAttributes['sub'];

    if (event.triggerSource === 'CustomMessage_ForgotPassword') {
      // TODO: check if codeParameter is necessary
      // const { codeParameter } = event.request;
      // &code=${codeParameter}`;
      // TODO: check url
      const href = `https://${env.domain}/auth/forgot-password?username=${username}`;
      const emailMessage = makeConfirmationForgotPasswordEmail(href);
      const emailSubject = 'Password dimenticata';
      const response = { ...event.response, emailMessage, emailSubject };
      return { ...event, response };
    } else {
      return event;
    }
  };
