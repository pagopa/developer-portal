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
  },
  {
    id: ['firma-con-io', 'quick-start'],
    name: 'Firma con IO',
    menu: pageRefList,
  },
];

export type PageId = ReadonlyArray<string>;

export type Page = {
  id: PageId;
  name: string;
  menu: ReadonlyArray<PageRef>;
};

export type PageRef = {
  title: string;
  href: string;
};
