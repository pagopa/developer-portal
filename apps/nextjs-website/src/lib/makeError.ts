export const makeError = ({ status, statusText }: Response) => {
  return new Error(`${status} - ${statusText}`);
};

export const makeErrorByMessage = (message?: string) => {
  return new Error(`${message ?? 'Unknown error'}`);
};
