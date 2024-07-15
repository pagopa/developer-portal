import EContainer from '@/editorialComponents/EContainer/EContainer';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import { Box, Grid, Typography } from '@mui/material';
import BlocksRendererClient from '@/components/molecules/BlocksRendererClient/BlocksRendererClient';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import ProductLayout from '@/components/organisms/ProductLayout/ProductLayout';
import { StrapiTutorials } from '@/lib/strapi/tutorial';
import { BlocksContent } from '@strapi/blocks-react-renderer';
import { Product } from '@/lib/types/product';

// TODO: Remove once the migration to CMS contents will be completed
type TutorialPageTemplateProps = {
  readonly bannerLinks?: StrapiTutorials['data'][0]['attributes']['bannerLinks'];
  readonly content?: BlocksContent;
  readonly path: string;
  readonly product?: Product;
  readonly relatedLinks?: StrapiTutorials['data'][0]['attributes']['relatedLinks'];
  readonly title: string;
};

const TutorialTemplate = ({
  bannerLinks,
  content,
  path,
  product,
  relatedLinks,
  title,
}: TutorialPageTemplateProps) => {
  return (
    <ProductLayout
      product={product}
      path={path}
      // bannerLinks={bannerLinks} // TODO: Enable this property once the bannerLinks refactor will be completed
    >
      {product && (
        <EContainer
          sx={{
            // 80px is the height of the product header
            marginTop: '80px',
            marginX: 'auto',
            paddingTop: 3,
          }}
        >
          <ProductBreadcrumbs
            breadcrumbs={[
              ...productPageToBreadcrumbs(product, path, [
                {
                  name: title,
                  path: path,
                },
              ]),
            ]}
          />
        </EContainer>
      )}
      <EContainer sx={{ paddingY: 7 }}>
        <FragmentProvider>
          <Grid container>
            <Grid item xs={12} lg={9}>
              <Typography
                component='h1'
                sx={{
                  fontSize: '38px',
                  fontWeight: 700,
                  lineHeight: '42px',
                  paddingY: 2,
                }}
              >
                {title}
              </Typography>
              <Box mt={1}>
                <BlocksRendererClient
                  content={content}
                  listStyle={{
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    listStylePosition: 'outside',
                    listStyleType: 'disc',
                    paddingLeft: '40px',
                  }}
                  paragraphSx={{
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    my: 2,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={false} lg={3}>
              <Box
                sx={{
                  position: 'sticky',
                  top: 200,
                  maxWidth: '270px',
                }}
              ></Box>
            </Grid>
          </Grid>
        </FragmentProvider>
      </EContainer>
      {relatedLinks && (
        <RelatedLinks
          title={relatedLinks?.title}
          links={relatedLinks?.links ?? []}
        />
      )}
    </ProductLayout>
  );
};

export default TutorialTemplate;
