import Markdoc, { Node } from '@markdoc/markdoc';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';

// Return the content of a Node of type 'text'
const parseText = ({ type, attributes }: Node): O.Option<string> =>
  type === 'text' && typeof attributes.content === 'string'
    ? O.fromNullable(attributes.content)
    : O.none;

export const parseTitle = (markdown: string): O.Option<string> =>
  pipe(
    Array.from(Markdoc.parse(markdown).walk()),
    RA.findFirst(
      ({ type, attributes }) => type === 'heading' && attributes.level === 1
    ),
    O.map((node) =>
      pipe(
        Array.from(node.walk()),
        RA.filterMap(parseText),
        RA.reduce('', (a, b) => a + b)
      )
    )
  );
