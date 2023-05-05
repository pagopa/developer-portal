import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { Box } from '@mui/material';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ComingSoon from '@/components/ComingSoon';
import ProductPreview from '@/components/ProductPreview';
import Highlighted from '@/components/Highlighted';
import HeroHome from '@/components/HeroHome';
import { GetStaticProps } from 'next';
import { Homepage } from '@/domain/homepage';
import { getHomepage, nextEnv } from '@/adapters/nextjs/lib';

export const getStaticProps: GetStaticProps<Homepage> = async () =>
  pipe(
    nextEnv,
    TE.chain(getHomepage),
    TE.bimap(
      () => ({ notFound: true as const }),
      (page) => ({ props: page })
    ),
    TE.toUnion
  )();

const Home = (props: Homepage) => (
  <Box>
    <Header />
    <HeroHome {...props.hero} />
    <Highlighted {...props.highlighted} />
    <ProductPreview {...props.productPreview} />
    <ComingSoon {...props.comingSoon} />
    <Footer />
  </Box>
);

export default Home;
