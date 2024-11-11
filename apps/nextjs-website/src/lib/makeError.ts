export const makeError = ({ status, statusText }: Response) => {
  return new Error(`${status} - ${statusText}`);
};
