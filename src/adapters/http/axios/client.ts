import * as t from 'io-ts';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { Task } from 'fp-ts/Task';
import { pipe } from 'fp-ts/lib/function';
import { failure } from 'io-ts/lib/PathReporter';
import * as IO from 'fp-ts/IO';

export type HttpClientConfig = {
  baseURL: URL;
  headers?: Record<string, string>;
  timeout?: number;
};

export const makeHttpClient = (config: HttpClientConfig): AxiosInstance =>
  axios.create({
    baseURL: config.baseURL.href,
    headers: config.headers,
    timeout: config.timeout || 5000,
  });

const errorsToError = (errors: t.Errors): Error =>
  pipe(failure(errors), (errors) => new Error(errors.join('\n')));

// TODO: This should be moved to a separate module
const log =
  (msg: string): IO.IO<void> =>
  () =>
    console.log(msg);

export const makeHttpRequest =
  (task: Task<AxiosResponse>) =>
  <I, O>(decode: (i: I) => t.Validation<O>): TE.TaskEither<Error, O> =>
    pipe(
      TE.tryCatch(task, E.toError),
      TE.chain(({ data }) =>
        pipe(
          TE.fromIO(
            pipe(
              log(`Response received: ${JSON.stringify(data)}`),
              IO.chain(() => log(`Decoding response`))
            )
          ),
          TE.chain((_) => TE.fromEither(decode(data))),
          TE.mapLeft(errorsToError),
          TE.chainFirst((_) => TE.fromIO(log('Response decoded')))
        )
      )
    );
