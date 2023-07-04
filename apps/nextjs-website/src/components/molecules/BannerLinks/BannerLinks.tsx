import React, { FC } from 'react';
import { Stack } from '@mui/material';
import { BannerLinkProps } from '@pagopa/pagopa-editorial-components/dist/components/BannerLink';
import { BannerLink } from '@/editorialComponents/BannerLink/BannerLink';

type BannerLinksProps = {
  banners?: BannerLinkProps[];
};

const BannerLinks: FC<BannerLinksProps> = ({ banners }) => (
  <Stack
    direction='row'
    justifyContent='space-between'
    alignItems='center'
    sx={{
      width: '100%',
    }}
  >
    {banners?.map((banner) => (
      <BannerLink
        key={banner.title}
        title={banner.title}
        theme={banner.theme}
        body={banner.body}
        decoration={banner.decoration}
      />
    ))}
  </Stack>
);

export default BannerLinks;
