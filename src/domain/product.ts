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
        type: 'hero',
        title: 'Firma lorem ipsum dolor sit',
        subtitle:
          'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien.',
        image: {
          src: 'https://images.unsplash.com/photo-1674594145584-354a3e88e9b5?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwxOTcwMjR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzcyNDUyNTY&ixlib=rb-4.0.3&q=80',
          alt: '...',
        },
        primaryRef: {
          title: 'Inizia',
          href: '/firma-con-io/quick-start',
        },
        secondaryRef: {
          title: 'Reference API',
          href: '/firma-con-io/api',
        },
      },
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
      {
        type: 'h2',
        text: 'Esplora i tutorial',
      },
      {
        type: 'cards',
        cards: [
          {
            type: 'card',
            image: {
              src: 'https://images.unsplash.com/photo-1674594145584-354a3e88e9b5?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwxOTcwMjR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzcyNDUyNTY&ixlib=rb-4.0.3&q=80',
              alt: '...',
            },
            elements: [
              {
                type: 'h3',
                text: 'In evidenza',
              },
              {
                type: 'h3',
                text: 'Scopri Firma con IO in 3 minuti',
              },
              {
                type: 'paragraph',
                text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi.',
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

export type Image = {
  src: string;
  alt: string;
};

export type Text = {
  type: 'h3' | 'h2' | 'h1' | 'paragraph';
  text: string;
};

export type Card = {
  type: 'card';
  image?: Image;
  elements: ReadonlyArray<Text>;
  href?: string;
};

export type Cards = {
  type: 'cards';
  cards: ReadonlyArray<Card>;
};

export type Hero = {
  type: 'hero';
  title: string;
  subtitle: string;
  image: Image;
  primaryRef: PageRef;
  secondaryRef: PageRef;
};

export type Element = Text | Cards | Hero;

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
