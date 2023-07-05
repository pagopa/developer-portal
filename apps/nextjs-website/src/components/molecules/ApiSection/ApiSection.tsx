import { useMemo, useState } from 'react';
import { ApiViewer } from '@/components/atoms/ApiViewer';
import { Product } from '@/lib/types/product';
import { MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material';
import { styles } from '@/components/molecules/ApiSection/ApiSection.styles';

export type ApiPageProps = {
  readonly product: Product;
  readonly specURLs: {
    name?: string;
    url: string;
    hideTryIt?: boolean;
  }[];
};

const ApiSection = ({ product, specURLs }: ApiPageProps) => {
  const [selectedItemURL, setSelectedItemURL] = useState(specURLs[0].url);
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedItemURL(event.target.value);
  };

  const selectedApi = useMemo(
    () => specURLs.find((item) => item?.url === selectedItemURL) || specURLs[0],
    [selectedItemURL, specURLs]
  );

  return (
    <>
      {specURLs.length > 1 && (
        <Stack sx={styles.container}>
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
      <ApiViewer
        product={product}
        specURL={selectedApi.url}
        hideTryIt={selectedApi.hideTryIt}
      />
    </>
  );
};

export default ApiSection;
