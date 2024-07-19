import EContainer from '@/editorialComponents/EContainer/EContainer';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import { Box, Grid, Typography } from '@mui/material';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import ProductLayout from '@/components/organisms/ProductLayout/ProductLayout';
import { StrapiTutorials } from '@/lib/strapi/tutorial';
import { Product } from '@/lib/types/product';
import PartRenderer from '@/components/molecules/PartRenderer/PartRenderer';
import { Part } from '@/lib/types/part';

// TODO: Remove once the migration to CMS contents will be completed
type TutorialPageTemplateProps = {
  readonly bannerLinks?: StrapiTutorials['data'][0]['attributes']['bannerLinks'];
  readonly parts?: readonly Part[];
  readonly path: string;
  readonly product?: Product;
  readonly relatedLinks?: StrapiTutorials['data'][0]['attributes']['relatedLinks'];
  readonly title: string;
};

const TutorialTemplate = ({
  bannerLinks,
  parts,
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
              {parts && (
                <Box mt={1}>
                  {parts.map((part, index) => (
                    <PartRenderer key={index} part={part} />
                  ))}
                </Box>
              )}
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
