import * as t from 'io-ts';
import { CustomMessageTriggerEvent } from 'aws-lambda';
import { makeConfirmationEmail } from './templates/confirmation-message';
import { makeConfirmationForgotPasswordEmail } from './templates/confirmation-forgot-password';
import { makeConfirmationUpdateEmailAddress } from './templates/confirmation-update-email-address';

import { EMAIL_TRANSLATIONS } from './templates/translations';

import { sanitize } from './utils/sanitize';

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
    const localeAttributes = event.request.userAttributes['locale'];
    const locale = localeAttributes ? localeAttributes : 'it'; // Default to 'it'

    if (
      eventTrigger === 'CustomMessage_SignUp' ||
      eventTrigger === 'CustomMessage_ResendCode'
    ) {
      if (cognitoUserStatus === 'CONFIRMED') {
        // eslint-disable-next-line functional/no-expression-statements
        console.warn(
          `User ${username} is confirmed and has requested to resend the email. Operation not permitted.`
        );
        return event;
      }
      const { codeParameter } = event.request;
      const href = `https://${env.domain}/auth/confirmation?username=${sanitize(
        username
      )}&code=${sanitize(codeParameter)}`;
      const emailMessage = makeConfirmationEmail(href, env.domain, locale);
      const emailSubject =
        EMAIL_TRANSLATIONS.confirmation[
          locale as keyof typeof EMAIL_TRANSLATIONS.confirmation
        ]?.subject || EMAIL_TRANSLATIONS.confirmation.it.subject;
      const response = { ...event.response, emailMessage, emailSubject };
      return { ...event, response };
    } else if (eventTrigger === 'CustomMessage_ForgotPassword') {
      const { codeParameter } = event.request;
      const href = `https://${env.domain
        }/auth/change-password?username=${sanitize(username)}&code=${sanitize(
          codeParameter
        )}`;
      const emailMessage = makeConfirmationForgotPasswordEmail(
        href,
        env.domain,
        locale
      );
      const emailSubject =
        EMAIL_TRANSLATIONS.confirmationForgotPassword[
          locale as keyof typeof EMAIL_TRANSLATIONS.confirmationForgotPassword
        ]?.subject || EMAIL_TRANSLATIONS.confirmationForgotPassword.it.subject;
      const response = { ...event.response, emailMessage, emailSubject };
      return { ...event, response };
    } else if (eventTrigger === 'CustomMessage_UpdateUserAttribute') {
      // eslint-disable-next-line functional/no-expression-statements
      console.log(`User ${username} has requested to update the email address`);
      const { codeParameter } = event.request;
      const href = `https://${env.domain
        }/auth/email-confirmation?username=${sanitize(username)}&code=${sanitize(
          codeParameter
        )}`;
      const emailMessage = makeConfirmationUpdateEmailAddress(
        href,
        env.domain,
        locale
      );
      const emailSubject =
        EMAIL_TRANSLATIONS.confirmationUpdateEmailAddress[
          locale as keyof typeof EMAIL_TRANSLATIONS.confirmationUpdateEmailAddress
        ]?.subject ||
        EMAIL_TRANSLATIONS.confirmationUpdateEmailAddress.it.subject;
      const response = { ...event.response, emailMessage, emailSubject };
      return { ...event, response };
    } else {
      return event;
    }
  };
