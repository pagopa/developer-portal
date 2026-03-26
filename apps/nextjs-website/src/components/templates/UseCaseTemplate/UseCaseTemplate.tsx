'use client';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import RelatedLinks, {
  RelatedLinksProps,
} from '@/components/atoms/RelatedLinks/RelatedLinks';
import ProductLayout from '@/components/organisms/ProductLayout/ProductLayout';
import { Product } from '@/lib/types/product';
import PartRenderer from '@/components/molecules/PartRenderer/PartRenderer';
import { Part } from '@/lib/types/part';
import { ReactNode } from 'react';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import EContainer from '../../../editorialComponents/EContainer/EContainer';
import { useParams } from 'next/navigation';

type UseCasePageTemplateProps = {
  readonly bannerLinks?: ReadonlyArray<BannerLinkProps>;
  readonly headerImage?: {
    readonly url: string;
    readonly alternativeText?: string;
  };
  readonly parts?: ReadonlyArray<Part>;
  readonly path: string;
  readonly product?: Product;
  readonly relatedLinks?: RelatedLinksProps;
  readonly structuredData?: ReactNode;
  readonly subtitle?: string;
  readonly title: string;
};

const UseCaseTemplate = ({
  bannerLinks,
  headerImage,
  parts,
  path,
  product,
  relatedLinks,
  structuredData,
  subtitle,
  title,
}: UseCasePageTemplateProps) => {
  const { palette } = useTheme();
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');
  const { locale } = useParams<{ locale: string }>();

  return (
    <ProductLayout
      product={product}
      path={path}
      structuredData={structuredData}
      bannerLinks={bannerLinks}
    >
      {product && (
        <Box
          paddingY={'74px'}
          style={{
            backgroundColor: palette.grey[50],
            backgroundImage:
              (headerImage && `url(${headerImage?.url})`) || 'none',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <EContainer>
            <ProductBreadcrumbs
              breadcrumbs={[
                ...productPageToBreadcrumbs(locale, product, [
                  {
                    translate: true,
                    name: 'devPortal.productHeader.useCases',
                    path: product.hasUseCaseListPage
                      ? `/${locale}/${product.slug}/use-cases`
                      : `/${locale}`,
                  },
                  {
                    name: title,
                    path: path,
                  },
                ]),
              ]}
              textColor={headerImage ? 'white' : palette.text.primary}
            />
          </EContainer>
          <EContainer>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                alignContent: 'flex-start',
                paddingTop: 10,
                paddingBottom: 20,
                width: '100%',
              }}
            >
              <Typography
                style={{
                  fontWeight: 700,
                  fontStyle: 'bold',
                  fontSize: isSmallScreen ? '32px' : '38px',
                  marginBottom: 16,
                  marginTop: 16,
                  color: headerImage ? 'white' : palette.text.primary,
                }}
              >
                {title}
              </Typography>
              <Typography
                style={{
                  fontWeight: 400,
                  fontStyle: 'regular',
                  fontSize: '1rem',
                  marginBottom: 16,
                  marginTop: 16,
                  color: headerImage ? 'white' : palette.text.primary,
                }}
              >
                {subtitle}
              </Typography>
            </Stack>
          </EContainer>
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
            {parts && (
              <Box mt={1}>
                {parts.map((part, index) => (
                  <PartRenderer key={index} part={part} />
                ))}
              </Box>
            )}
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

export default UseCaseTemplate;
