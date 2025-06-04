'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  MenuItem,
  MenuList,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types/product';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export type ApiSoapSectionProps = {
  readonly product: Product;
  readonly apisName: string;
  readonly apisSlug: string;
  readonly apiUrls: {
    name?: string;
    url: string;
  }[];
};

const ApiSoapSection = ({
  product,
  apisName,
  apisSlug,
  apiUrls,
}: ApiSoapSectionProps) => {
  const { palette } = useTheme();

  const [selectedItemUrl, setSelectedItemUrl] = useState(apiUrls[0].url);

  const router = useRouter();
  const searchParams = useSearchParams();

  // if a spec query param is present, try to match it with the specURLs, if found, set it as selectedItemURL
  useEffect(() => {
    const specName = searchParams.get('spec');
    if (specName) {
      const decodedSpecName = decodeURIComponent(specName as string);
      const spec = apiUrls.find((item) => item?.name === decodedSpecName);
      if (spec) {
        setSelectedItemUrl(spec.url);
      }
    }
  }, [searchParams, apiUrls]);

  const handleItemSelect = (urlItem: string) => {
    setSelectedItemUrl(urlItem);

    const spec = apiUrls.find((item) => item?.url === urlItem);

    if (apisName && spec?.name) {
      // update the url with the spec query param
      router.replace(
        `/${product.slug}/api/${apisSlug}?spec=${encodeURIComponent(spec.name)}`
      );
    }
  };

  const selectedApi = useMemo(
    () => apiUrls.find((item) => item?.url === selectedItemUrl) || apiUrls[0],
    [selectedItemUrl, apiUrls]
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
      {apiUrls.length > 1 && apisName && (
        <Stack
          direction='row'
          justifyContent='flex-start'
          alignContent='center'
          sx={{
            height: '100%',
          }}
        >
          <Box
            sx={{
              width: 280,
              bgcolor: '#F2F2F2',
              paddingTop: '2rem',
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
              {apisName}
            </Typography>
            <MenuList dense>
              {apiUrls.map((item) => (
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
          <Box
            sx={{
              paddingX: '100px',
              width: '100%',
              height: '100%',
            }}
          >
            <iframe
              src={selectedApi.url}
              style={{
                border: 'none',
                height: '100%',
              }}
              height='100%'
              width='100%'
              title='API SOAP Documentation'
            />
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default ApiSoapSection;
