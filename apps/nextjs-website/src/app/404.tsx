import { translations } from '@/_contents/translations';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { getProducts } from '@/lib/api';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import { GetStaticProps, GetStaticPropsResult } from 'next';
import { useTheme } from '@mui/material';

export default function PageNotFound() {
  const { pageNotFound } = translations;

  const products = [...getProducts()];
  return (
    <Layout products={products}>
      <Abstract
        layout='center'
        overline={pageNotFound.overline}
        title={pageNotFound.title}
        description={pageNotFound.description}
      />
    </Layout>
  );
}
