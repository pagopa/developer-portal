import { InferGetStaticPropsType } from 'next';
import { getCollections } from '@/adapters/gitbook/collections';
import { HeaderAccount, RootLinkType, Showcase } from '@pagopa/mui-italia';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { Collection } from '@/domain/collection';
import { Box, Stack } from '@mui/material';
import Footer from '@/components/Footer';

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

const pagoPALink: RootLinkType = {
  href: 'https://www.pagopa.it/',
  label: 'PagoPA Dev Portal',
  title: 'PagoPA Dev Portal',
  ariaLabel: 'PagoPA Dev Portal',
};

const Home = ({
  collections,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // This is just an example. Here we are rendering a list of collections, using MUI-Italia components.
  // Data are fetched from GitBook, using GitBook API.
  return (
    <>
      <Box>
        <Stack>
          <Box>
            {
              // Header is here just as an example. Later we are going to create a custom element
            }
            <HeaderAccount
              enableLogin={false}
              rootLink={pagoPALink}
              onAssistanceClick={() => {}}
            />
          </Box>
          <Box>
            {
              // Showcase is here just as an example.
            }
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
    </>
  );
};

export default Home;
