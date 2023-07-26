import { ReactNode } from 'react';

type ItemProps = {
  checked: boolean;
  children: ReactNode;
};

const Item = ({ checked, children }: ItemProps) => <li>{children}</li>;

export default Item;
