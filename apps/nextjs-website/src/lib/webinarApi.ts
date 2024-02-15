// This file contains application logic adapted to be easily integrated by pages
// or components within the app and components folders, e.g.: provide a valid
// application environment (AppEnv) and transform TaskEither to Promise
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { makeBrowserEnv } from '@/BrowserEnv';
import {
  InsertWebinarQuestion,
  WebinarQuestion,
  insertWebinarQuestion,
  listWebinarQuestions,
  highlightWebinarQuestion,
  hideWebinarQuestion,
} from './webinars/webinarQuestions';
import { makeBrowserConfig, publicEnv } from '@/BrowserConfig';

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

export const highlightQuestion = (
  question: WebinarQuestion,
  highlight: boolean,
  highlightedBy: string
) =>
  pipe(
    highlightWebinarQuestion(question, highlight, highlightedBy)(browserEnv),
    makePromiseFromTE
  )();

export const hideQuestion = (
  question: WebinarQuestion,
  hide: boolean,
  hiddenBy: string
) =>
  pipe(
    hideWebinarQuestion(question, hide, hiddenBy)(browserEnv),
    makePromiseFromTE
  )();
