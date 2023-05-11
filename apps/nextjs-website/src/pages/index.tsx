import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { Box } from '@mui/material';
import Footer from 'ui/components/Footer';
import Header from 'ui/components/Header';
import ComingSoon from 'ui/components/ComingSoon';
import ProductPreview from 'ui/components/ProductPreview';
import Highlighted from 'ui/components/Highlighted';
import HeroHome from 'ui/components/HeroHome';
import { Homepage } from 'core/domain/homepage';
import { GetStaticProps } from 'next';
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
