import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductSubHeader from '@/components/ProductSubHeader';
import {
  getProductPage,
  ProductPageId,
  ProductPage,
  getProductPageIdList,
} from '@/domain/product';
import { Box } from '@mui/material';
import { GetStaticPaths, GetStaticProps } from 'next';

export const getStaticPaths: GetStaticPaths<ProductPageId> = async () => ({
  paths: getProductPageIdList().map((productPageId) => ({
    params: productPageId,
  })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<
  ProductPage,
  ProductPageId
> = async ({ params }) => ({
  // TODO remove the !
  props: getProductPage(params!),
});

const ProductPage = (props: ProductPage) => (
  <Box>
    <Header />
    <ProductSubHeader title={props.productName} pages={props.productPages} />
    <div>{props.body}</div>
    <Footer />
  </Box>
);

export default ProductPage;
