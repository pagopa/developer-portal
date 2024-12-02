import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import { Box, Typography } from '@mui/material';
import RelatedLinks, {
  RelatedLinksProps,
} from '@/components/atoms/RelatedLinks/RelatedLinks';
import ProductLayout from '@/components/organisms/ProductLayout/ProductLayout';
import { Product } from '@/lib/types/product';
import PartRenderer from '@/components/molecules/PartRenderer/PartRenderer';
import { Part } from '@/lib/types/part';
import PartRendererMenu from '@/components/molecules/PartRendererMenu/PartRendererMenu';
import { ReactNode } from 'react';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';

// TODO: Remove once the migration to CMS contents will be completed
type TutorialPageTemplateProps = {
  readonly bannerLinks?: ReadonlyArray<BannerLinkProps>;
  readonly parts?: ReadonlyArray<Part>;
  readonly path: string;
  readonly product?: Product;
  readonly relatedLinks?: RelatedLinksProps;
  readonly title: string;
  readonly structuredData?: ReactNode;
};

const TutorialTemplate = ({
  parts,
  path,
  product,
  relatedLinks,
  bannerLinks,
  title,
  structuredData,
}: TutorialPageTemplateProps) => {
  return (
    <ProductLayout
      product={product}
      path={path}
      structuredData={structuredData}
      bannerLinks={bannerLinks}
    >
      {product && (
        <Box
          sx={{
            maxWidth: '1200px',
            // 80px is the height of the product header
            marginTop: '80px',
            marginX: 'auto',
            paddingTop: 3,
            px: { xs: 4, lg: 0 },
          }}
        >
          <ProductBreadcrumbs
            breadcrumbs={[
              ...productPageToBreadcrumbs(product, [
                {
                  translate: true,
                  name: 'devPortal.productHeader.tutorials',
                  path: product.hasTutorialListPage
                    ? `/${product.slug}/tutorials`
                    : '',
                },
                {
                  name: title,
                  path: path,
                },
              ]),
            ]}
          />
        </Box>
      )}
      <FragmentProvider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            maxWidth: '1200px',
            margin: '0 auto',
            paddingBottom: !((relatedLinks?.links?.length ?? 0) > 0)
              ? '56px'
              : 0,
            paddingTop: '56px',
            px: { xs: 4, lg: 0 },
          }}
        >
          <Box
            sx={{
              flexGrow: { lg: 1 },
              maxWidth: {
                xs: '100%',
                lg: '822px',
              },
              overflowWrap: 'break-word',
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
              paddingTop: '30px',
              paddingLeft: '60px',
              width: { lg: '378px' },
            }}
          >
            <Box
              sx={{
                position: 'sticky',
                maxWidth: '378px',
                top: 140,
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
