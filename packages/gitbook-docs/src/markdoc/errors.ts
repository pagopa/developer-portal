import { ValidationError } from '@markdoc/markdoc';

export const hasMissingClosingError = (
  errors: ReadonlyArray<ValidationError>,
  errorId: string
) => errors.find(({ id }) => id === errorId);
