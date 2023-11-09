import * as t from 'io-ts';
import { CustomMessageTriggerEvent } from 'aws-lambda';
import mjml2html from 'mjml';
import { minify } from 'html-minifier';
import confirmationMessage from './templates/confirmation-message';

export const CustomMessageEnv = t.type({
  domain: t.string,
});
export type CustomMessageEnv = t.TypeOf<typeof CustomMessageEnv>;

export const emailTemplate = (href: string) => {
  const emailMessage = mjml2html(confirmationMessage(href)).html;

  return minify(emailMessage, {
    collapseWhitespace: true,
    minifyCSS: true,
    caseSensitive: true,
    removeEmptyAttributes: true,
  });
};

export const makeHandler =
  (env: CustomMessageEnv) => async (event: CustomMessageTriggerEvent) => {
    const username = event.request.userAttributes['sub'];

    if (
      event.triggerSource === 'CustomMessage_SignUp' ||
      event.triggerSource === 'CustomMessage_ResendCode'
    ) {
      const { codeParameter } = event.request;
      const href = `https://${env.domain}/auth/confirmation?username=${username}&code=${codeParameter}`;
      const emailMessage = emailTemplate(href);
      const emailSubject = 'Verifica la tua e-mail per PagoPA DevPortal';
      const response = { ...event.response, emailMessage, emailSubject };
      return { ...event, response };
    } else {
      return event;
    }
  };
