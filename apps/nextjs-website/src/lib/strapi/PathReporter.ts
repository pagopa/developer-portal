import * as t from 'io-ts';

const getMessage = (error: t.ValidationError): string => {
  if (error.message) {
    return error.message;
  } else {
    const jsonPath = error.context.map(({ key }) => `${key}`).join('/');
    const expected = error.context[error.context.length - 1].type.name;
    return `Invalid value ${error.value} supplied to '${jsonPath}', expected type ${expected}`;
  }
};

export const failure = (errors: t.Errors): ReadonlyArray<string> =>
  errors.map(getMessage);
