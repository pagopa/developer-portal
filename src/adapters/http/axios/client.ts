import * as t from 'io-ts';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { Task } from 'fp-ts/Task';
import { pipe, flow } from 'fp-ts/lib/function';
import { failure } from 'io-ts/lib/PathReporter';

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

export const errorsToError = flow(
  failure,
  (errors) => new Error(errors.join('\n'))
);

export const makeHttpRequest =
  (task: Task<AxiosResponse>) =>
  <I, O>(decode: (i: I) => t.Validation<O>): TE.TaskEither<Error, O> =>
    pipe(
      TE.tryCatch(task, E.toError),
      TE.bimap(
        (err) => {
          console.log(`Error during HTTP request: ${err}`);
          return new Error(`Error during HTTP request: ${err}`);
        },
        // Decode the response
        ({ data }) => decode(data)
      ),
      TE.map(flow(E.mapLeft(errorsToError), TE.fromEither)),
      TE.flatten
    );
