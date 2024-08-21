import ContentWrapper from '@/components/atoms/ContentWrapper/ContentWrapper';

export default function WebinarsLayout({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return <ContentWrapper>{children}</ContentWrapper>;
}
