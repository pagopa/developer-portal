'use client';
import React, { FC } from 'react';
import { Stack } from '@mui/material';
import {
  BannerLink,
  BannerLinkProps,
} from '@/components/atoms/BannerLink/BannerLink';

type BannerLinksProps = {
  banners?: readonly BannerLinkProps[];
  bannerLinkMaxWidth?: number;
};

function CalculateJustify(index: number, length: number) {
  return length == 1 ? 'center' : index === 0 ? 'right' : 'left';
}

export const BannerLinks: FC<BannerLinksProps> = ({
  banners,
  bannerLinkMaxWidth = 450,
}) => (
  <Stack
    direction={{ xs: 'column', md: 'row' }}
    justifyContent='space-between'
    alignItems='stretch'
    sx={{
      width: '100%',
    }}
  >
    {banners?.slice(0, 2).map((banner, index) => (
      //TODO: Remove the slice once introduced a validator BE side to limit the number of bannerLink items
      <BannerLink
        contentMaxWidth={bannerLinkMaxWidth}
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
