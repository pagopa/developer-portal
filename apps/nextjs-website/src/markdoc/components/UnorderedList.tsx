import { ReactNode } from 'react';
import styles from './UnorderedList.module.css';

type UnorderedListProps = {
  children: ReactNode;
};

const UnorderedList = ({ children }: UnorderedListProps) => {
  return <ul className={styles.UnorderedList}>{children}</ul>;
};

export default UnorderedList;
