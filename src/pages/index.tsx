import { InferGetStaticPropsType } from 'next';
import { getCollections } from '@/adapters/gitbook/collections';
import { Showcase } from '@pagopa/mui-italia';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { Collection } from '@/domain/collection';
import { Box, Stack } from '@mui/material';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroSpace from '@/components/HeroSpace';

export const getStaticProps = () => {
  const emptyCollections: ReadonlyArray<Collection> = [];
  return pipe(
    getCollections(),
    TE.getOrElse(() => T.of(emptyCollections)),
    T.map((collections) => ({
      props: {
        collections,
      },
    }))
  )();
};

const Home = ({
  collections,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // This is just an example. Here we are rendering a list of collections, using MUI-Italia components.
  // Data are fetched from GitBook, using GitBook API.
  return (
    <Box>
      <Stack>
        <Header />
        <Box>
          <HeroSpace
            title='Firma lorem ipsum dolor sit'
            description='Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien.'
            image={{
              src: 'https://raw.githubusercontent.com/pagopa/mui-italia/main/src/assets/LogoIOApp/originals/LogoIOApp.svg', // Just an example
              altText: 'Logo IO App',
            }}
            buttons={[
              { label: 'Inizia', title: 'Inizia', onClick: () => {} },
              {
                label: 'Reference API',
                title: 'Reference API',
                onClick: () => {},
              },
            ]}
          />
          <Showcase
            items={collections.map((coll) => ({
              title: coll.title,
              subtitle: coll.title,
            }))}
            title='Collections'
          />
        </Box>
        <Footer />
      </Stack>
    </Box>
  );
};

export default Home;
