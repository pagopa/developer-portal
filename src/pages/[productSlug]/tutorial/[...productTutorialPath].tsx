import { staticNav } from '@/adapters/static/staticNav';
import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MuiMarkdown from '@/components/MuiMarkdown';
import { makeBreadcrumbs } from '@/domain/navigator';
import { ProductTutorialPage } from '@/domain/productTutorialPage';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { makeAppEnv } from '@/AppEnv';
import { makeAppConfig } from '@/AppConfig';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

// TODO: Find a way to load the appEnv only once and
// somehow provides it to the entire application
const appEnv = pipe(
  TE.fromEither(makeAppConfig(process.env)),
  TE.chain(makeAppEnv)
);

type Params = {
  productSlug: string;
  productTutorialPath: Array<string>;
};

export const getStaticPaths: GetStaticPaths<Params> = async () => ({
  paths: await pipe(
    appEnv,
    TE.chain(({ productTutorialPageReader }) =>
      productTutorialPageReader.getAllPaths()
    ),
    TE.bimap(
      () => [],
      (result) => [...result]
    ),
    TE.toUnion
  )(),
  fallback: false,
});

export const getStaticProps: GetStaticProps<
  ProductTutorialPage,
  Params
> = async ({ params }) =>
  pipe(
    TE.Do,
    TE.apS('params', TE.fromNullable(new Error('params is undefined'))(params)),
    TE.apS('appEnv', appEnv),
    TE.chain(({ appEnv, params: { productSlug, productTutorialPath } }) =>
      appEnv.productTutorialPageReader.getPageBy(
        `/${productSlug}/tutorial/${productTutorialPath.join('/')}`
      )
    ),
    TE.chain(TE.fromOption(() => new Error('Not Found'))),
    TE.bimap(
      () => ({ notFound: true as const }),
      (page) => ({
        props: {
          ...page,
        },
      })
    ),
    TE.toUnion
  )();

const Tutorial = (props: ProductTutorialPage) => {
  return (
    <Box>
      <Stack>
        <Header />
        <Box bgcolor='background.paper' sx={{ p: 5 }}>
          <Container maxWidth='xl'>
            <Breadcrumbs
              items={makeBreadcrumbs(staticNav, useRouter().asPath)}
            />
            <Container maxWidth='md'>
              <Stack
                spacing={3}
                sx={{ pt: 10, pb: 5 }}
                justifyContent='center'
                textAlign='center'
              >
                <Typography variant='h4' color='text.primary'>
                  {props.title}
                </Typography>
                <Typography variant='body1' color='text.primary'>
                  {props.description}
                </Typography>
              </Stack>
            </Container>
          </Container>
        </Box>
        <Container maxWidth='lg'>
          <Stack spacing={3} sx={{ pt: 10, pb: 20 }}>
            <MuiMarkdown body={props.body} />
          </Stack>
        </Container>
        <Footer />
      </Stack>
    </Box>
  );
};

export default Tutorial;
