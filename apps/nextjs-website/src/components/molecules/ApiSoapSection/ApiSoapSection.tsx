'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Link as LinkMui,
  MenuItem,
  MenuList,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types/product';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import _ from 'lodash';

export type ApiSoapSectionProps = {
  readonly product: Product;
  readonly apiName: string;
  readonly apiSlug: string;
  readonly apiRepositoryUrl?: string;
  readonly apiUrls: readonly string[];
};

const ApiSoapSection = ({
  product,
  apiName,
  apiSlug,
  apiRepositoryUrl,
  apiUrls,
}: ApiSoapSectionProps) => {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations();
  const { palette } = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedItemUrl, setSelectedItemUrl] = useState(apiUrls[0]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiMenuItems = apiUrls
    .map((url) => ({
      url: url,
      // eslint-disable-next-line functional/immutable-data
      name: _.split(_.split(url, '/').pop(), '.')[0] || '',
    }))
    .filter((item) => !!item.name);

  useEffect(() => {
    const specName = searchParams.get('spec');
    if (specName) {
      const decodedSpecName = decodeURIComponent(specName as string);
      const spec = apiMenuItems.find((item) => item?.name === decodedSpecName);
      if (spec) {
        setSelectedItemUrl(spec.url);
      }
    }
  }, [searchParams, apiMenuItems]);

  const handleItemSelect = (urlItem: string) => {
    setSelectedItemUrl(urlItem);

    const spec = apiMenuItems.find((item) => item?.url === urlItem);

    if (spec?.name) {
      router.replace(
        `/${locale}/${product.slug}/api/${apiSlug}?spec=${encodeURIComponent(
          spec.name
        )}`
      );
    }

    document.getElementById('soapApiStack')?.scroll(0, 0);
  };

  const selectedApi = useMemo(
    () =>
      apiMenuItems.find((item) => item?.url === selectedItemUrl) ||
      apiMenuItems[0],
    [selectedItemUrl, apiMenuItems]
  );
  const borderColor = palette.divider;

  return (
    <Box
      sx={{
        borderTop: { md: `1px solid ${borderColor}` },
        marginTop: { xs: '-42px', sm: '-22px', md: 0 },
        height: '100vh',
      }}
    >
      {apiMenuItems.length > 1 && apiName && (
        <Stack
          id='soapApiStack'
          direction='row'
          justifyContent='flex-start'
          alignContent='center'
          sx={{
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              width: 280,
              bgcolor: palette.background.default,
              paddingTop: '2rem',
              position: 'sticky',
              top: 0,
              height: 'calc(100% - 1px)',
            }}
          >
            <Typography
              noWrap={true}
              sx={{
                paddingX: '2rem',
                paddingY: '1rem',
                color: palette.text.primary,
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              {apiName}
            </Typography>
            <MenuList dense>
              {apiMenuItems.map((item) => (
                <MenuItem
                  key={item.url}
                  onClick={() => handleItemSelect(item.url)}
                  sx={{
                    paddingX: '2rem',
                    paddingY: '0.5rem',
                    background:
                      selectedItemUrl === item.url
                        ? 'rgba(0, 115, 230, 0.08)'
                        : 'transparent',
                    '&:hover': {
                      background:
                        selectedItemUrl === item.url
                          ? 'rgba(0, 115, 230, 0.08)'
                          : 'rgba(0, 115, 230, 0.04)',
                    },
                  }}
                >
                  <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    width='100%'
                    spacing={1}
                  >
                    <Typography
                      noWrap={true}
                      sx={{
                        fontWeight: 400,
                        fontSize: '0.875rem',
                      }}
                    >
                      {item.name || item.url}
                    </Typography>
                    <ArrowForwardIosIcon sx={{ fontSize: '0.75rem' }} />
                  </Stack>
                </MenuItem>
              ))}
            </MenuList>
          </Box>
          <Stack
            direction='column'
            sx={{
              width: '100%',
              height: '100%',
            }}
          >
            <Box
              sx={{
                marginX: '100px',
                paddingBlock: 4,
                paddingTop: 7,
                width: '90%',
                minWidth: 800,
              }}
            >
              <iframe
                ref={iframeRef}
                src={selectedApi.url}
                style={{
                  border: 'none',
                  width: '100%',
                  height: '80vh',
                }}
                title={t('apiDataPage.soap.iframeTitle')}
              />
            </Box>
            {apiRepositoryUrl && (
              <Box
                sx={{
                  paddingLeft: 20,
                  paddingBottom: 8,
                  paddingTop: 2,
                }}
              >
                <LinkMui
                  component={Link}
                  underline='none'
                  href={apiRepositoryUrl}
                  target='_blank'
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '1rem',
                      textDecoration: 'underline',
                    }}
                  >
                    {t('apiDataPage.soap.repoLink')}
                  </Typography>
                </LinkMui>
              </Box>
            )}
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default ApiSoapSection;
