import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
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
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import {
  getProductTutorialPageBy,
  getProductTutorialPages,
} from '@/adapters/static/staticProductTutorialPage';

type Params = {
  productSlug: string;
  tutorialSlug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: pipe(
    getProductTutorialPages(),
    RA.map(({ product, slug }) => ({
      params: { productSlug: product.slug, tutorialSlug: slug },
    })),
    (array) => [...array]
  ),
  fallback: false,
});

export const getStaticProps: GetStaticProps<ProductTutorialPage, Params> = (
  context
) =>
  pipe(
    O.fromNullable(context.params),
    O.chain(({ productSlug, tutorialSlug }) =>
      getProductTutorialPageBy(productSlug, tutorialSlug)
    ),
    O.foldW(
      () => ({ notFound: true }),
      (page) => ({
        props: {
          ...page,
        },
      })
    )
  );

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
