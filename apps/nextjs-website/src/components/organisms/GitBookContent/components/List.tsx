import { ListProps } from 'gitbook-docs/markdoc/schema/list';
import { ReactNode } from 'react';

const List = ({ ordered, children }: ListProps<ReactNode>) =>
  ordered ? <ol>{children}</ol> : <ul>{children}</ul>;

export default List;
