import { HeadingProps } from 'gitbook-docs/markdoc/schema/heading';
import { ReactNode } from 'react';
import ContentHeading from '@/components/atoms/ContentHeading/ContentHeading';

const createSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

export const SubHeading = ({
  level,
  id,
  children,
}: HeadingProps<ReactNode>) => {
  return (
    <ContentHeading
      level={level}
      id={createSlug(children ? children.toString() : id)}
      skipH1={true}
    >
      {children}
    </ContentHeading>
  );
};

const Heading = ({ level, id, children }: HeadingProps<ReactNode>) => (
  <ContentHeading level={level} id={id}>
    {children}
  </ContentHeading>
);

export default Heading;
