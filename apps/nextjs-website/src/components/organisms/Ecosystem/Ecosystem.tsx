'use client';
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import TabComponent from '@/components/atoms/TabComponent/TabComponent';
import { HomepageProps } from '@/lib/homepage';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import { ButtonNaked } from '@pagopa/mui-italia';
import Link from 'next/link';

const Ecosystem = ({
  title,
  products,
  productsTabName,
  solutionsTabName,
  solutions,
  solutionsCta,
}: HomepageProps['ecosystem']) => {
  const theme = useTheme();
  return (
    <Box pt={10} pb={0} sx={{ backgroundColor: theme.palette.grey[50] }}>
      <Box sx={{ maxWidth: '1200px', margin: 'auto' }}>
        {title && (
          <Typography variant='h4' sx={{ mb: 4, width: '100%' }}>
            {title}
          </Typography>
        )}
        <TabComponent
          items={[
            {
              title: productsTabName,
              content: (
                <CardsGrid
                  ctaButtonsVariant={'contained'}
                  cards={products}
                  containerSx={{ px: 0, pb: '22px' }}
                />
              ),
            },
            {
              title: solutionsTabName,
              content: (
                <>
                  {solutions && (
                    <CardsGrid
                      ctaButtonsVariant={'contained'}
                      cards={solutions}
                      containerSx={{ px: 0, pb: '22px' }}
                    />
                  )}
                  {solutionsCta && (
                    <Box textAlign={'center'}>
                      <ButtonNaked
                        component={Link}
                        href={solutionsCta.link.href}
                        color={'primary'}
                        variant={solutionsCta.variant || 'contained'}
                        sx={{ mb: 3 }}
                        target={solutionsCta.link.target ?? '_self'}
                      >
                        {solutionsCta.link.text}
                      </ButtonNaked>
                    </Box>
                  )}
                </>
              ),
            },
          ]}
          variant='fullWidth'
          centered
          sx={{ px: 0 }}
        />
      </Box>
    </Box>
  );
};

export default Ecosystem;
