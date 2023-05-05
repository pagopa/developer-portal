import { Box } from '@mui/material';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ComingSoon from '@/components/ComingSoon';
import ProductPreview from '@/components/ProductPreview';
import Highlighted from '@/components/Highlighted';
import HeroHome from '@/components/HeroHome';
import { GetStaticProps } from 'next';
import { Homepage } from '@/domain/homepage';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { makeAppConfig } from '@/AppConfig';
import { makeAppEnv } from '@/AppEnv';

// TODO: Find a way to load the appEnv only once and
// somehow provides it to the entire application
const appEnv = pipe(
  TE.fromEither(makeAppConfig(process.env)),
  TE.chain(makeAppEnv)
);

export const getStaticProps: GetStaticProps<Homepage> = async () =>
  pipe(
    appEnv,
    TE.chain(({ homepageReader }) => homepageReader.getPage()),
    TE.bimap(
      () => ({ notFound: true as const }),
      (page) => ({
        props: page,
      })
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
