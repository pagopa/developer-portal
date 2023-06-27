import { Box } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
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
      {title}
      <Box fontWeight={'bold'} sx={{ pl: 0.8, pr: 1.6 }}>
        {boldTitle}
      </Box>
    </ButtonNaked>
  );
};

export default HomepageButton;
