// This file contains application logic adapted to be easily integrated by pages
// or components within the app and components folders, e.g.: provide a valid
// application environment (AppEnv) and transform TaskEither to Promise
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import {
  InsertWebinarQuestion,
  insertWebinarQuestion,
  listWebinarQuestion,
} from './webinars/webinarQuestions';
import { appEnv } from '@/AppEnv';

const makePromiseFromTE = <E, A>(input: TE.TaskEither<E, A>) =>
  pipe(
    input,
    TE.fold(
      // eslint-disable-next-line functional/no-promise-reject
      (error) => () => Promise.reject(error),
      (result) => () => Promise.resolve(result)
    )
  );

export const sendWebinarQuestion = (question: InsertWebinarQuestion) =>
  pipe(insertWebinarQuestion(question)(appEnv), makePromiseFromTE)();

export const getWebinarQuestionList = (webinarId: string) =>
  pipe(listWebinarQuestion(webinarId)(appEnv), makePromiseFromTE)();
