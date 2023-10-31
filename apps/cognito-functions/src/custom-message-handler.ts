import * as t from 'io-ts';
import { CustomMessageTriggerEvent } from 'aws-lambda';

export const CustomMessageEnv = t.type({
  domain: t.string,
});
export type CustomMessageEnv = t.TypeOf<typeof CustomMessageEnv>;

export const emailTemplate = (href: string) => `
Ciao,
<br />
Grazie per aver creato un account sul DevPortal!
Non ti resta che confermarci la validità di questa e-mail.
<br />
<a href="${href}">Verifica e-mail</a>
<br />
Il bottone non funziona? Puoi usare il seguente link: <a href="${href}">${href}</a>
`;

export const makeHandler =
  (env: CustomMessageEnv) => async (event: CustomMessageTriggerEvent) => {
    const username = event.request.userAttributes['sub'];

    if (event.triggerSource === 'CustomMessage_SignUp') {
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
