import { notFound } from 'next/navigation';

type Props = {
  readonly params: Promise<{
    readonly locale: string;
    readonly notFound: readonly string[];
  }>;
};

const CatchAllNotFoundPage = async ({ params }: Props) => {
  const { locale, notFound: segments } = await params;

  console.error(`Page not found: path="/${locale}/${segments.join('/')}"`);

  notFound();
};

export default CatchAllNotFoundPage;
