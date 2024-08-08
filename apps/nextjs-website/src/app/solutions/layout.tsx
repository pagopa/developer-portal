import ContentWrapper from '@/components/atoms/ContentWrapper/ContentWrapper';

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return <ContentWrapper>{children}</ContentWrapper>;
}
