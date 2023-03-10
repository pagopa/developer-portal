import * as S from 'fp-ts/string';
import * as RA from 'fp-ts/ReadonlyArray';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductSubHeader from '@/components/ProductSubHeader';
import { Page, pageList } from '@/domain/product';
import { Box, Stack } from '@mui/material';
import { GetStaticPaths } from 'next';
import { pipe } from 'fp-ts/lib/function';
import PageElement from '@/components/Element';

type Params = {
  params: Page;
};

export const getStaticPaths: GetStaticPaths<{
  id: Array<string>;
}> = async () => ({
  paths: pageList.map((page) => ({
    params: { id: [...page.id] },
  })),
  fallback: false,
});

export const getStaticProps = async ({ params }: Params) => ({
  props: pageList.find(({ id }) => RA.getEq(S.Eq).equals(id, params.id)),
});

const ProductPage = (props: Page) => {
  return (
    <Box>
      <Header />
      <ProductSubHeader title={props.name} pages={props.menu} />
      <Stack spacing={2}>{pipe(props.body, RA.map(PageElement))}</Stack>
      <Footer />
    </Box>
  );
};

export default ProductPage;
