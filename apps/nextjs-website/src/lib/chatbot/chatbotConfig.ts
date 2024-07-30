import * as t from 'io-ts';
import * as E from 'fp-ts/lib/Either';
import * as PR from 'io-ts/lib/PathReporter';
import { pipe } from 'fp-ts/lib/function';

export const ChatbotConfigCodec = t.type({
  CHATBOT_HOST: t.string,
});

export type ChatbotConfig = t.TypeOf<typeof ChatbotConfigCodec>;

export const publicEnv = {
  CHATBOT_HOST: process.env.NEXT_PUBLIC_CHATBOT_HOST,
};

export const makeChatbotConfig = (
  env: Record<string, undefined | string>
): E.Either<string, ChatbotConfig> =>
  pipe(
    ChatbotConfigCodec.decode(env),
    E.mapLeft((errors) => PR.failure(errors).join('\n'))
  );
