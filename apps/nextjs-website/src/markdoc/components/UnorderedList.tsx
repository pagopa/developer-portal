import { ReactNode } from 'react';

type UnorderedListProps = {
  children: ReactNode;
};

const UnorderedList = ({ children }: UnorderedListProps) => {
  return <ul style={{ margin: 0, padding: 0 }}>{children}</ul>;
};

export default UnorderedList;
