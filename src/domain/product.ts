const pageRefList = [
  {
    title: 'Panoramica',
    href: '/firma-con-io/panoramica',
  },
  {
    title: 'Quick Start',
    href: '/firma-con-io/quick-start',
  },
];

export const pageList: ReadonlyArray<Page> = [
  {
    id: ['firma-con-io', 'panoramica'],
    name: 'Firma con IO',
    menu: pageRefList,
    body: [
      {
        type: 'h2',
        text: 'Cosa puoi fare con Firma con IO',
      },
      {
        type: 'paragraph',
        text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et. Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et.',
      },
      {
        type: 'h2',
        text: 'Per iniziare',
      },
      {
        type: 'paragraph',
        text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et. Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et.',
      },
      {
        type: 'cards',
        cards: [
          {
            type: 'card',
            elements: [
              {
                type: 'h3',
                text: 'Step 01: Prepara i documenti',
              },
              {
                type: 'paragraph',
                text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi.',
              },
            ],
          },
          {
            type: 'card',
            elements: [
              {
                type: 'h3',
                text: 'Step 02: Prepara i documenti',
              },
              {
                type: 'paragraph',
                text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi.',
              },
            ],
          },
          {
            type: 'card',
            elements: [
              {
                type: 'h3',
                text: 'Step 02: Prepara i documenti',
              },
              {
                type: 'paragraph',
                text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi.',
              },
            ],
          },
          {
            type: 'card',
            elements: [
              {
                type: 'h3',
                text: 'Step 02: Prepara i documenti',
              },
              {
                type: 'paragraph',
                text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: ['firma-con-io', 'quick-start'],
    name: 'Firma con IO',
    menu: pageRefList,
    body: [],
  },
];

export type Text = {
  type: 'h3' | 'h2' | 'h1' | 'paragraph';
  text: string;
};

export type Card = {
  type: 'card';
  elements: ReadonlyArray<Text>;
  href?: string;
};

export type Cards = {
  type: 'cards';
  cards: ReadonlyArray<Card>;
};

export type Element = Text | Cards;

export type PageId = ReadonlyArray<string>;

export type Page = {
  id: PageId;
  name: string;
  menu: ReadonlyArray<PageRef>;
  body: ReadonlyArray<Element>;
};

export type PageRef = {
  title: string;
  href: string;
};
