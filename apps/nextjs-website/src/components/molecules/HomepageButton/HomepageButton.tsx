'use client';
import SiteLabel from '@/components/atoms/SiteLabel/SiteLabel';
import { Button } from '@mui/material';
import Link from 'next/link';
import React from 'react';

type HomepageButtonProps = {
  readonly title: string;
  readonly boldTitle: string;
  readonly href?: string;
};

const HomepageButton = ({
  title,
  boldTitle,
  href = '/',
}: HomepageButtonProps) => {
  const completeTitle = [title, boldTitle].join(' ');
  return (
    <Button
      size={'medium'}
      sx={{
        color: 'common.black',
        marginLeft: 0,
        paddingLeft: 0,
        paddingRight: 0,
        marginRight: 0,
      }}
      component={Link}
      aria-label={completeTitle}
      href={href}
      title={completeTitle}
    >
      <SiteLabel title={title} color={'inherit'} boldTitle={boldTitle} />
    </Button>
  );
};

export default HomepageButton;
