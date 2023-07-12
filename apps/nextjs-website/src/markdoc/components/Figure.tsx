import { ReactNode } from 'react';

type FigureProps = {
  children: ReactNode;
};

const Figure = ({ children }: FigureProps) => <>{children}</>;

export default Figure;
