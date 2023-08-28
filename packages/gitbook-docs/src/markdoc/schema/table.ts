import { pipe } from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import Markdoc, { Schema, Node } from '@markdoc/markdoc';
import { BooleanAttr, LinkAttr, SrcAttr } from '../attributes';

type ChildrenAttr<A> = {
  readonly children: A;
};

export type TableProps<A> = ChildrenAttr<A> & {
  readonly headerIsHidden: boolean;
};
export type TableHeadProps<A> = ChildrenAttr<A>;
export type TableBodyProps<A> = ChildrenAttr<A>;
export type TableRProps<A> = ChildrenAttr<A>;
export type TableHProps<A> = ChildrenAttr<A>;
export type TableDProps<A> = ChildrenAttr<A>;

export type CardsProps<A> = ChildrenAttr<A> & {
  readonly size: 'large' | 'small';
};
export type CardProps<A> = ChildrenAttr<A> & {
  readonly coverSrc?: string;
  readonly href?: string;
};
export type CardItemProps<A> = ChildrenAttr<A>;

const thead: Schema = {
  render: 'TableHead',
};

const tbody: Schema = {
  render: 'TableBody',
};

const tr: Schema = {
  render: 'TableR',
};

const th: Schema = {
  render: 'TableH',
};

const td: Schema = {
  render: 'TableD',
};

const cards: Schema = {
  attributes: {
    'data-card-size': {
      type: String,
      // The 'data-card-size' attribute can assume only the value 'large'. The
      // value 'small' is never provided. When the property 'data-card-size'
      // is missing it is intended as small. This is why the default value is
      // small
      matches: ['large'],
      render: 'size',
      default: 'small',
    },
  },
};

const card: Schema = {
  render: 'Card',
  attributes: {
    coverSrc: { type: SrcAttr },
    href: { type: LinkAttr },
  },
};

const carditem: Schema = {
  render: 'CardItem',
};

const extractDataCardHref = (
  attrName: string,
  nodes: ReadonlyArray<Node>
): string | undefined =>
  pipe(
    [...nodes],
    A.findFirstMap(({ attributes, children }) =>
      pipe(
        attributes[attrName] === '' ? children : [],
        A.findFirstMap(({ attributes }) =>
          typeof attributes.href === 'string' ? O.some(attributes.href) : O.none
        )
      )
    ),
    O.toUndefined
  );

const makeCardsNode = (node: Node) =>
  pipe(
    Array.from(node.walk()),
    A.filterMap(({ tag, children }) =>
      tag === 'htmltr' ? O.some(children) : O.none
    ),
    A.matchLeft(
      () => new Markdoc.Ast.Node('node', node.attributes, [], 'cards'),
      (head, rows) =>
        pipe(
          rows,
          A.map((row) =>
            A.zipWith(head, row, (head, { attributes, children }) => {
              const attrs = { ...head.attributes, ...attributes };
              return new Markdoc.Ast.Node('node', attrs, children, 'carditem');
            })
          ),
          A.map((carditems) => {
            const coverSrc = extractDataCardHref('data-card-cover', carditems);
            const href = extractDataCardHref('data-card-target', carditems);
            // Add coverSrc and href as attribute taking them from card children
            const attrs = { coverSrc, href };
            // Keep only the visible children
            const children = carditems.filter(
              ({ attributes }) => attributes['data-hidden'] !== ''
            );
            return new Markdoc.Ast.Node('node', attrs, children, 'card');
          }),
          (cards) =>
            new Markdoc.Ast.Node('node', node.attributes, cards, 'cards')
        )
    )
  );

export const table: Schema = {
  attributes: {
    'data-header-hidden': { type: BooleanAttr, render: 'headerIsHidden' },
  },
  transform: (node, config) => {
    // A table can be a Markdown table and an html table.
    // An html table can be "viewed" as card
    if (node.attributes['data-view'] === 'cards') {
      // handle html table viewed as card
      const tags = { ...config.tags, cards, card, carditem };
      const cardsNode = makeCardsNode(node);
      const attrs = cardsNode.transformAttributes({ ...config, tags });
      const children = cardsNode.transformChildren({ ...config, tags });
      return new Markdoc.Tag('Cards', attrs, children);
    } else {
      // handle markdown table and html table
      // override nodes renders to handle markdown table
      const nodes = { ...config.nodes, thead, tbody, tr, th, td };
      // override tags renders to handle html table tag
      const tags = {
        ...config.tags,
        htmlthead: thead,
        htmltbody: tbody,
        htmltr: tr,
        htmlth: th,
        htmltd: td,
      };
      const attrs = node.transformAttributes({ ...config, nodes, tags });
      const children = node.transformChildren({ ...config, nodes, tags });
      return new Markdoc.Tag('Table', attrs, children);
    }
  },
};
