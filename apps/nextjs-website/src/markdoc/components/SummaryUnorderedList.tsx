import { ReactNode } from 'react';
import styles from './SummaryUnorderedList.module.css';

type SummaryUnorderedListProps = {
  children: ReactNode[];
};

const SummaryUnorderedList = ({ children }: SummaryUnorderedListProps) => {
  return <div className={styles.SummaryUnorderedList}>{children}</div>;
};

export default SummaryUnorderedList;
