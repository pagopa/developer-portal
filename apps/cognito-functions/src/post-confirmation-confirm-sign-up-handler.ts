import { PostConfirmationConfirmSignUpTriggerEvent } from 'aws-lambda';
import {
  SES,
  SendEmailCommand,
  SendEmailCommandInput,
} from '@aws-sdk/client-ses';
import * as t from 'io-ts';

const emailBody = (firstName: string) => `
<h4>Finalmente sei dei nostri</h4>

Ciao ${firstName}, <br />
Siamo felici di averti a bordo. <br />
Il DevPortal di PagoPA è il portale web unico, ufficiale e aggiornato per il reperimento di tutte le risorse utili all’integrazione con i nostri prodotti. <br />

Al suo interno troverai:
<ul>
<li>Strumenti interattivi che offrono una vista sintetica del processo di integrazione di ogni prodotto;</li>
<li>Documentazione API, guide tecniche e manuali per approfondire tutte le informazioni di dettaglio;</li>
<li>Tutorial che ti accompagneranno nello svolgimento di task specifici.</li>
</ul>
`;

const makeSesEmailParameters = (
  to: string,
  from: string,
  subject: string,
  body: string
): SendEmailCommandInput => ({
  Destination: {
    ToAddresses: [to],
  },
  Message: {
    Body: {
      Html: {
        Data: body,
      },
    },
    Subject: {
      Data: subject,
    },
  },
  Source: from,
});

export const PostConfirmationConfig = t.type({
  fromEmailAddress: t.string,
});
type SendEmailConfig = t.TypeOf<typeof PostConfirmationConfig>;

export type PostConfirmationEnv = {
  readonly config: SendEmailConfig;
  readonly ses: SES;
};

export const makeHandler =
  ({ ses, config }: PostConfirmationEnv) =>
  async (event: PostConfirmationConfirmSignUpTriggerEvent) => {
    const { email, given_name } = event.request.userAttributes;
    if (email) {
      const fromEmail = config.fromEmailAddress;
      const subject = 'Il tuo account è attivo';
      const params = makeSesEmailParameters(
        email,
        fromEmail,
        subject,
        emailBody(given_name)
      );
      // eslint-disable-next-line functional/no-try-statements
      try {
        // eslint-disable-next-line functional/no-expression-statements
        await ses.send(new SendEmailCommand(params));
      } catch (err) {
        // eslint-disable-next-line functional/no-expression-statements
        console.log(err);
      }
    }
    return event;
  };
