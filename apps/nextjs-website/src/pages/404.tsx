import { translations } from '@/_contents/translations';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { getProducts } from '@/lib/api';
import { GetStaticProps, GetStaticPropsResult } from 'next';

export type PageNotFoundProps = LayoutProps;

export const getStaticProps: GetStaticProps<
  PageNotFoundProps
> = (): GetStaticPropsResult<LayoutProps> => {
  return { props: { products: [...getProducts()] } };
};

export default function PageNotFound({ products }: PageNotFoundProps) {
  const { pageNotFound } = translations;

  return (
    <Layout products={products}>
      <SectionTitle
        title={pageNotFound.title}
        cta={{
          label: pageNotFound.cta.label,
          href: pageNotFound.cta.href,
        }}
      />
    </Layout>
  );
}
