import { useMemo, useState } from 'react';
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { ApiViewer } from '@/components/atoms/ApiViewer';
import { Product } from '@/lib/types/product';
import { IconName, getIconFromName } from '@/helpers/getIconFromName';
import { styles } from '@/components/molecules/ApiSection/ApiSection.styles';

export type ApiPageProps = {
  readonly product: Product;
  readonly specURLs: {
    name?: string;
    url: string;
    hideTryIt?: boolean;
  }[];
  readonly soapDocumentation?: {
    title: string;
    url: string;
    buttonLabel: string;
    icon: IconName;
  };
};

const ApiSection = ({ product, specURLs, soapDocumentation }: ApiPageProps) => {
  const { palette, spacing } = useTheme();

  const [selectedItemURL, setSelectedItemURL] = useState(specURLs[0].url);
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedItemURL(event.target.value);
  };

  const selectedApi = useMemo(
    () => specURLs.find((item) => item?.url === selectedItemURL) || specURLs[0],
    [selectedItemURL, specURLs]
  );
  const textColor = palette.primary.contrastText;

  return (
    <>
      {specURLs.length > 1 && (
        <Stack sx={styles.selectContainer}>
          <Stack width={400}>
            <Select
              value={selectedItemURL}
              onChange={handleChange}
              size='small'
              variant='outlined'
              sx={styles.select}
            >
              {specURLs.map((item, index) => (
                <MenuItem value={item.url} key={index}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Stack>
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
              }}
              component={Link}
              aria-label={soapDocumentation.buttonLabel}
              href={soapDocumentation.url}
              title={soapDocumentation.buttonLabel}
              endIcon={getIconFromName({
                type: soapDocumentation.icon,
                fill: textColor,
                size: 24,
              })}
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
