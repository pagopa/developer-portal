import { translations } from '@/_contents/translations';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { getProducts } from '@/lib/api';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import { GetStaticProps, GetStaticPropsResult } from 'next';
import { useTheme } from '@mui/material';

export type PageNotFoundProps = LayoutProps;

export const getStaticProps: GetStaticProps<
  PageNotFoundProps
> = (): GetStaticPropsResult<LayoutProps> => {
  return { props: { products: [...getProducts()] } };
};

export default function PageNotFound({ products }: PageNotFoundProps) {
  const { palette } = useTheme();
  const { pageNotFound } = translations;

  return (
    <Layout products={products}>
      <Abstract
        layout='center'
        overline={pageNotFound.overline}
        title={pageNotFound.title}
        description={pageNotFound.description}
        theme={palette.mode}
      />
    </Layout>
  );
}
