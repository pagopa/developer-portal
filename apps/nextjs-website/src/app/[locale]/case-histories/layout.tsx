import ContentWrapper from '@/components/atoms/ContentWrapper/ContentWrapper';

export default function CaseHistoriesLayout({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return <ContentWrapper>{children}</ContentWrapper>;
}
