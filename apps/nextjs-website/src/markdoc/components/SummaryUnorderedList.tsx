import { ReactNode } from 'react';

type SummaryUnorderedListProps = {
  children: ReactNode[];
};

const SummaryUnorderedList = ({ children }: SummaryUnorderedListProps) => {
  return (
    <div style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
      {children}
    </div>
  );
};

export default SummaryUnorderedList;
