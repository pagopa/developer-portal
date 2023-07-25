import { pipe } from 'fp-ts/lib/function';
import * as t from 'io-ts';
import * as O from 'fp-ts/lib/Option';
import Markdoc, { Schema } from '@markdoc/markdoc';
import yaml from 'js-yaml';

const codec = t.type({
  description: t.string,
});

export const document: Schema = {
  transform: (node, config) => {
    const [head, ...tail] = node.children;

    const children = pipe(
      O.fromNullable(node.attributes.frontmatter),
      O.chain((frontmatter) =>
        O.fromEither(codec.decode(yaml.load(frontmatter)))
      ),
      O.map(
        ({ description }) =>
          new Markdoc.Ast.Node('paragraph', {}, [
            new Markdoc.Ast.Node('text', { content: description }),
          ])
      ),
      O.map((description) =>
        head.type === 'heading'
          ? [head, description, ...tail]
          : [description, head, ...tail]
      ),
      O.getOrElse(() => [head, ...tail])
    );

    // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
    node.children = children;

    return node.transformChildren(config);
  },
};
