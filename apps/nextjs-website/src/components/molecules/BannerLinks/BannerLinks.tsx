'use client';
import React, { FC } from 'react';
import { Stack } from '@mui/material';
import { BannerLink, BannerLinkProps } from '@/editorialComponents/BannerLink/BannerLink';

type BannerLinksProps = {
  banners?: readonly BannerLinkProps[];
};

const BannerLinks: FC<BannerLinksProps> = ({ banners }) => (
  <Stack
    direction='row'
    justifyContent='space-between'
    alignItems='stretch'
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
