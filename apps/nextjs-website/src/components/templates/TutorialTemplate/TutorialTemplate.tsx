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
import { PRODUCT_HEADER_HEIGHT, SITE_HEADER_HEIGHT } from '@/config';
import { useParams } from 'next/navigation';

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
  const { locale } = useParams<{ locale: string }>();
  return (
    <ProductLayout
      product={product}
      path={path}
      structuredData={structuredData}
      bannerLinks={bannerLinks}
    >
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
            {product && (
              <Box
                sx={{
                  maxWidth: '1200px',
                  marginX: 'auto',
                  px: { xs: 4, lg: 0 },
                  marginY: 2,
                }}
              >
                <ProductBreadcrumbs
                  breadcrumbs={[
                    ...productPageToBreadcrumbs(locale, product, [
                      {
                        translate: true,
                        name: 'devPortal.productHeader.tutorials',
                        path: product.hasTutorialListPage
                          ? `/${locale}/${product.slug}/tutorials`
                          : `/${locale}`,
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
            <Typography
              component='h1'
              sx={{
                fontSize: '38px',
                fontWeight: 700,
                lineHeight: '42px',
                paddingY: 4,
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
              marginLeft: '60px',
              width: { lg: '378px' },
            }}
          >
            <Box
              sx={{
                maxHeight: `calc(100vh - ${
                  SITE_HEADER_HEIGHT + PRODUCT_HEADER_HEIGHT
                }px)`,
                maxWidth: '378px',
                overflowY: 'auto',
                paddingY: '42px',
                position: 'sticky',
                top: SITE_HEADER_HEIGHT + PRODUCT_HEADER_HEIGHT,
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
