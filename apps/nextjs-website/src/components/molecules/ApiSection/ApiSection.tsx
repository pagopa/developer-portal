import { useEffect, useMemo, useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  formLabelClasses,
  styled,
  useTheme,
} from '@mui/material';
import { ApiViewer } from '@/components/atoms/ApiViewer';
import { Product } from '@/lib/types/product';
import { getStyles } from '@/components/molecules/ApiSection/ApiSection.styles';
import Link from 'next/link';
import { ButtonNaked } from '@pagopa/mui-italia';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import { useRouter } from 'next/router';

export type ApiPageProps = {
  readonly product: Product;
  readonly specURLsName?: string;
  readonly specURLs: {
    name?: string;
    url: string;
    hideTryIt?: boolean;
  }[];
  readonly soapDocumentation?: {
    title: string;
    url: string;
    buttonLabel: string;
    icon: string;
  };
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

const ApiSection = ({
  product,
  specURLs,
  specURLsName,
  soapDocumentation,
}: ApiPageProps) => {
  const { palette, spacing } = useTheme();

  const [selectedItemURL, setSelectedItemURL] = useState(specURLs[0].url);

  const router = useRouter();

  // if a spec query param is present, try to match it with the specURLs, if found, set it as selectedItemURL
  useEffect(() => {
    const specName = router.query?.spec;
    if (specName) {
      const decodedSpecName = decodeURIComponent(specName as string);
      const spec = specURLs.find((item) => item?.name === decodedSpecName);
      if (spec) {
        setSelectedItemURL(spec.url);
      }
    }
  }, [router.query, specURLs]);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedItemURL(event.target.value);

    const spec = specURLs.find((item) => item?.url === event.target.value);

    if (specURLsName && spec?.name) {
      // update the url with the spec query param
      router.replace(
        `${product.subpaths.api?.path}?spec=${encodeURIComponent(spec.name)}`
      );
    }
  };

  const selectedApi = useMemo(
    () => specURLs.find((item) => item?.url === selectedItemURL) || specURLs[0],
    [selectedItemURL, specURLs]
  );
  const textColor = palette.primary.contrastText;
  const styles = getStyles(palette);

  return (
    <>
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
      {soapDocumentation && (
        <Stack
          sx={styles.soapContainer}
          alignItems='center'
          justifyContent='flex-end'
          direction='row'
          height={spacing(8)}
          gap={spacing(2)}
        >
          <Typography variant='body2' color={textColor}>
            {soapDocumentation.title}
          </Typography>
          <Stack
            alignItems='center'
            justifyContent='flex-end'
            direction='row'
            gap={spacing(1)}
          >
            <ButtonNaked
              sx={{
                color: textColor,
                '&:hover': {
                  color: textColor,
                },
              }}
              component={Link}
              aria-label={soapDocumentation.buttonLabel}
              href={soapDocumentation.url}
              title={soapDocumentation.buttonLabel}
              endIcon={
                <IconWrapper icon={soapDocumentation.icon} color={textColor} />
              }
            >
              {soapDocumentation.buttonLabel}
            </ButtonNaked>
          </Stack>
        </Stack>
      )}
      <ApiViewer
        product={product}
        specURL={selectedApi.url}
        hideTryIt={selectedApi.hideTryIt}
      />
    </>
  );
};

export default ApiSection;
