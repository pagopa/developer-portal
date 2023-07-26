import { ReactNode } from 'react';

type ListProps = {
  ordered: boolean;
  children: ReactNode;
};

const List = ({ ordered, children }: ListProps) =>
  ordered ? <ol>{children}</ol> : <ul>{children}</ul>;

export default List;
