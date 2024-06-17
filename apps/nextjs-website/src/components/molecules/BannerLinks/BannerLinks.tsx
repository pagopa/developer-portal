'use client';
import React, { FC } from 'react';
import { Stack } from '@mui/material';
import {
  BannerLink,
  BannerLinkProps,
} from '@/components/atoms/BannerLink/BannerLink';

type BannerLinksProps = {
  banners?: readonly BannerLinkProps[];
};

function CalculateJustify(index: number, length: number) {
  return index == 0
    ? length === 1
      ? 'center'
      : 'right'
    : length <= 2
    ? 'left'
    : index > 1
    ? 'left'
    : 'center';
}

const BannerLinks: FC<BannerLinksProps> = ({ banners }) => (
  <Stack
    direction={{ xs: 'column', md: 'row' }}
    justifyContent='space-between'
    alignItems='stretch'
    sx={{
      width: '100%',
    }}
  >
    {banners?.map((banner, index) => (
      <BannerLink
        maxWidth={448}
        justify={CalculateJustify(index, banners.length)}
        key={index}
        title={banner.title}
        icon={banner.icon}
        content={banner.content}
        theme={banner.theme}
      />
    ))}
  </Stack>
);

export default BannerLinks;
