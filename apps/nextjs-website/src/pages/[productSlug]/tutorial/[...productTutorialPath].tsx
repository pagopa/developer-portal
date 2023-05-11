import {
  findProductTutorialPageByPath,
  getAllProductTutorialPagePaths,
  nextEnv,
} from '@/lib/api';
import Breadcrumbs, { BreadcrumbsProps } from 'ui/components/Breadcrumbs';
import Footer from 'ui/components/Footer';
import Header from 'ui/components/Header';
import MuiMarkdown from 'ui/components/MuiMarkdown';
import { ProductTutorialPage } from 'core/domain/productTutorialPage';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { GetStaticPaths, GetStaticProps } from 'next';

type Params = {
  productSlug: string;
  productTutorialPath: Array<string>;
};

type ProductTutorialPageProps = ProductTutorialPage & {
  breadcrumbs: BreadcrumbsProps['items'];
};

export const getStaticPaths: GetStaticPaths<Params> = async () => ({
  paths: await pipe(
    nextEnv,
    TE.chain(getAllProductTutorialPagePaths),
    TE.getOrElseW(() => T.of([]))
  )(),
  fallback: false,
});

export const getStaticProps: GetStaticProps<
  ProductTutorialPage,
  Params
> = async ({ params }) =>
  pipe(
    nextEnv,
    TE.chain(
      findProductTutorialPageByPath(
        `/${params?.productSlug}/tutorial/${params?.productTutorialPath}`
      )
    ),
    TE.chain(TE.fromOption(() => new Error('Not Found'))),
    TE.bimap(
      () => ({ notFound: true as const }),
      (page) => ({ props: page })
    ),
    TE.toUnion
  )();

const Tutorial = (props: ProductTutorialPageProps) => {
  return (
    <Box>
      <Stack>
        <Header />
        <Box bgcolor='background.paper' sx={{ p: 5 }}>
          <Container maxWidth='xl'>
            <Breadcrumbs items={props.breadcrumbs} />
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
