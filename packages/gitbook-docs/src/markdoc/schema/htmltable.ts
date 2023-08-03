import Markdoc, { Schema } from '@markdoc/markdoc';
import { table, tbody, td, th, thead, tr } from './table';

export const htmltable: Schema = {
  transform: (node, config) => {
    const tags = {
      ...config.tags,
      htmltable: table,
      htmlthead: thead,
      htmltbody: tbody,
      htmltr: tr,
      htmlth: th,
      htmltd: td,
    };
    const attrs = node.transformAttributes({ ...config, tags });
    const children = node.transformChildren({ ...config, tags });
    return new Markdoc.Tag('Table', attrs, children);
  },
};
