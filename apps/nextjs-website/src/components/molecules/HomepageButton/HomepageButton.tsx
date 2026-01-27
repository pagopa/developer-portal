'use client';
import { ButtonNaked } from '@/components/atoms/ButtonNaked/ButtonNaked';
import SiteLabel from '@/components/atoms/SiteLabel/SiteLabel';
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
    <ButtonNaked
      size={'medium'}
      weight={'light'}
      component={Link}
      aria-label={completeTitle}
      href={href}
      title={completeTitle}
    >
      <SiteLabel title={title} color={'inherit'} boldTitle={boldTitle} />
    </ButtonNaked>
  );
};

export default HomepageButton;
