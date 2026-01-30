'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  FormControl,
  formLabelClasses,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  styled,
  useTheme,
} from '@mui/material';
import { Product } from '@/lib/types/product';
import { getStyles } from '@/components/molecules/ApiRestSection/ApiRestSection.styles';
import { useRouter, useSearchParams } from 'next/navigation';
import Spinner from '@/components/atoms/Spinner/Spinner';
import dynamic from 'next/dynamic';

const ApiViewer = dynamic(
  () => import('@/components/atoms/ApiViewer/ApiViewer'),
  {
    loading: () => <Spinner />,
    ssr: false,
  }
);

export type ApiRestPageProps = {
  readonly product: Product;
  readonly specURLsName?: string;
  readonly apiSlug: string;
  readonly specURLs: {
    name?: string;
    url: string;
    hideTryIt?: boolean;
  }[];
};

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  alignSelf: 'center',
  [`& .${formLabelClasses.root}`]: {
    color: `${theme.palette.common.white}`,
    marginTop: '7px',
    marginLeft: '8px',
  },
  [`& .${formLabelClasses.root}.${formLabelClasses.focused}`]: {
    color: `${theme.palette.common.white}`,
  },
}));

const ApiRestSection = ({
  apiSlug,
  product,
  specURLs,
  specURLsName,
}: ApiRestPageProps) => {
  const { palette } = useTheme();

  const [selectedItemURL, setSelectedItemURL] = useState(specURLs[0].url);

  const router = useRouter();
  const searchParams = useSearchParams();

  // if a spec query param is present, try to match it with the specURLs, if found, set it as selectedItemURL
  useEffect(() => {
    const specName = searchParams.get('spec');
    if (specName) {
      const decodedSpecName = decodeURIComponent(specName as string);
      const spec = specURLs.find((item) => item?.name === decodedSpecName);
      if (spec) {
        setSelectedItemURL(spec.url);
      }
    }
  }, [searchParams, specURLs]);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedItemURL(event.target.value);

    const spec = specURLs.find((item) => item?.url === event.target.value);

    if (specURLsName && spec?.name) {
      // update the url with the spec query param
      router.replace(
        `/${product.slug}/api/${apiSlug}?spec=${encodeURIComponent(spec.name)}`
      );
    }
  };

  const selectedApi = useMemo(
    () => specURLs.find((item) => item?.url === selectedItemURL) || specURLs[0],
    [selectedItemURL, specURLs]
  );
  const borderColor = palette.divider;
  const styles = getStyles(palette);

  return (
    <Box
      sx={{
        borderTop: { md: `1px solid ${borderColor}` },
        marginTop: { xs: '-42px', sm: '-22px', md: 0 },
      }}
    >
      {specURLs.length > 1 && specURLsName && (
        <Stack
          sx={styles.selectContainer}
          direction='row'
          justifyContent='flex-end'
          alignContent='center'
        >
          <StyledFormControl size='medium'>
            <InputLabel id='select-api-label'>{specURLsName}</InputLabel>
            <Select
              labelId='select-api-label'
              value={selectedItemURL}
              onChange={handleChange}
              size='small'
              sx={styles.select}
              id='select-api'
              variant='outlined'
              label={specURLsName}
            >
              {specURLs.map((item, index) => (
                <MenuItem value={item.url} key={index}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </Stack>
      )}
      <ApiViewer specURL={selectedApi.url} />
    </Box>
  );
};

export default ApiRestSection;
