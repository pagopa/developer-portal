// This file contains application logic adapted to be easily integrated by pages
// or components within the app and components folders, e.g.: provide a valid
// application environment (AppEnv) and transform TaskEither to Promise
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { makeBrowserEnv } from '@/BrowserEnv';
import {
  InsertWebinarQuestion,
  WebinarQuestionUpdate,
  insertWebinarQuestion,
  listWebinarQuestions,
  updateWebinarQuestion as _updateWebinarQuestion,
} from './webinars/webinarQuestions';
import { makeBrowserConfig, publicEnv } from '@/BrowserConfig';
import {
  deleteWebinarSubscription,
  insertWebinarSubscription,
  listUserWebinarSubscriptions,
} from './webinars/webinarSubscriptions';

// a BrowserEnv instance ready to be used
const browserEnv = pipe(
  makeBrowserConfig(publicEnv),
  E.map(makeBrowserEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

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
  pipe(insertWebinarQuestion(question)(browserEnv), makePromiseFromTE)();

export const getWebinarQuestionList = (webinarId: string) =>
  pipe(listWebinarQuestions(webinarId)(browserEnv), makePromiseFromTE)();

export const updateWebinarQuestion = (update: WebinarQuestionUpdate) =>
  pipe(_updateWebinarQuestion(update)(browserEnv), makePromiseFromTE)();

export const subscribeToWebinar = (webinarId: string, username: string) =>
  pipe(
    insertWebinarSubscription(webinarId, username)(browserEnv),
    makePromiseFromTE
  )();

export const unsubscribeToWebinar = (webinarId: string, username: string) =>
  pipe(
    deleteWebinarSubscription(webinarId, username)(browserEnv),
    makePromiseFromTE
  )();

export const getUserWebinarSubscriptions = (username: string) =>
  pipe(listUserWebinarSubscriptions(username)(browserEnv), makePromiseFromTE)();
