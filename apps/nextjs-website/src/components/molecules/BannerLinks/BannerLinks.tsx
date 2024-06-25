'use client';
import React, { FC } from 'react';
import { Stack } from '@mui/material';
import {
  BannerLink,
  BannerLinkProps,
} from '@/components/atoms/BannerLink/BannerLink';

type BannerLinksProps = {
  bannerLinks?: readonly BannerLinkProps[];
};

function CalculateJustify(index: number, length: number) {
  return length == 1 ? 'center' : index === 0 ? 'right' : 'left';
}

export const BannerLinks: FC<BannerLinksProps> = ({ bannerLinks }) => (
  <Stack
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: 'stretch',
      justifyContent: 'space-between',
      width: '100%',
    }}
  >
    {bannerLinks?.map((bannerLink, index) => (
      <BannerLink
        contentJustification={CalculateJustify(index, bannerLinks.length)}
        key={index}
        title={bannerLink.title}
        icon={bannerLink.icon}
        body={bannerLink.body}
        theme={bannerLink.theme}
      />
    ))}
  </Stack>
);

export default BannerLinks;
