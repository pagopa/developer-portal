import * as O from 'fp-ts/Option';
import { parseTitle } from '../parseTitle';

describe('parseTitle', () => {
  it('should return first h1 as title', () => {
    expect(parseTitle('# A Title')).toStrictEqual(O.some('A Title'));
    expect(parseTitle('# A **Title**')).toStrictEqual(O.some('A Title'));
    expect(parseTitle('## A Title')).toStrictEqual(O.none);
  });
});
