import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import { Box, Typography } from '@mui/material';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import ProductLayout from '@/components/organisms/ProductLayout/ProductLayout';
import { StrapiTutorials } from '@/lib/strapi/tutorial';
import { Product } from '@/lib/types/product';
import PartRenderer from '@/components/molecules/PartRenderer/PartRenderer';
import { Part } from '@/lib/types/part';
import PartRendererMenu from '@/components/molecules/PartRendererMenu/PartRendererMenu';
import EContainer from '@/editorialComponents/EContainer/EContainer';

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
      <FragmentProvider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            maxWidth: '1156px',
            margin: '0 auto',
            paddingY: '56px',
          }}
        >
          <Box
            sx={{
              flexGrow: { lg: 1 },
              maxWidth: {
                xs: '100%',
                lg: '822px',
              },
            }}
          >
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
          </Box>
          <Box
            sx={{
              display: { xs: 'none', lg: 'initial' },
              position: 'relative',
              // 78px is the height of the header, 80px is the height of the product header
              paddingTop: '158px',
              paddingLeft: '64px',
              width: { lg: '270px' },
            }}
          >
            <Box
              sx={{
                position: 'sticky',
                maxWidth: '270px',
                top: 144,
              }}
            >
              <PartRendererMenu parts={parts ?? []} />
            </Box>
          </Box>
        </Box>
      </FragmentProvider>
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
