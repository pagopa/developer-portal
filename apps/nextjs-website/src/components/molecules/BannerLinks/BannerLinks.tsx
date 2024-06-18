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
  return (
    (length === 1 && 'center') ||
    (index === 0 && 'right') ||
    (index === length - 1 && 'left') ||
    'center'
  );
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
    {banners?.map((banner, index) => (
      <BannerLink
        contentMaxWidth={bannerLinkMaxWidth}
        justify={CalculateJustify(index, banners.length)}
        key={index}
        title={banner.title}
        icon={banner.icon}
        content={banner.content}
        count={banners.length}
        theme={banner.theme}
      />
    ))}
  </Stack>
);

export default BannerLinks;
