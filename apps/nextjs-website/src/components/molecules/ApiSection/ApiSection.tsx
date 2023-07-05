import { useMemo, useState } from 'react';
import { ApiViewer } from '@/components/atoms/ApiViewer';
import { Product } from '@/lib/types/product';
import { MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material';
import { styles } from './ApiSection.styles';

export type ApiPageProps = {
  readonly product: Product;
  readonly specURLs: {
    url: string;
    hideTryIt?: boolean;
  }[];
};

const ApiSection = ({ product, specURLs }: ApiPageProps) => {
  const [selectedItem, setSelectedItem] = useState(specURLs[0].url);
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedItem(event.target.value);
  };

  const selectedApi = useMemo(
    () => specURLs.find((item) => item?.url === selectedItem) || specURLs[0],
    [selectedItem, specURLs]
  );

  return (
    <>
      {specURLs.length > 1 && (
        <Stack sx={{ background: '#0D1018' }}>
          <Stack width={400}>
            <Select
              value={selectedItem}
              onChange={handleChange}
              size='small'
              variant='outlined'
              sx={styles.select}
            >
              {specURLs.map((item, index) => (
                <MenuItem value={item.url} key={index}>
                  {item.url}
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
