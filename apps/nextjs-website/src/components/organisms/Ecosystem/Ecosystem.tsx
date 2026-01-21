'use client';
import React from 'react';
import { Box, useTheme } from '@mui/material';
import TabComponent from '@/components/atoms/TabComponent/TabComponent';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import Link from 'next/link';
import { HomepageProps } from '@/app/page';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { ButtonNaked } from '@/components/atoms/ButtonNaked/ButtonNaked';

const Ecosystem = ({
  title,
  products,
  productsTabName,
  solutionsTabName,
  solutions,
  solutionsCta,
}: Required<HomepageProps>['ecosystem']) => {
  const theme = useTheme();
  return (
    <Box pt={10} pb={0} sx={{ backgroundColor: theme.palette.grey[50] }}>
      {title && <SectionTitle margin={'0 0 1.75rem 0'} title={title} />}
      <Box
        sx={{
          maxWidth: '1264px',
          margin: 'auto',
          paddingX: 4,
        }}
      >
        <TabComponent
          items={[
            {
              title: productsTabName,
              content: (
                <CardsGrid
                  ctaButtonsVariant={'contained'}
                  cards={products}
                  containerSx={{
                    px: '22px',
                    py: '22px',
                    mt: '-22px',
                    mx: '-22px',
                  }}
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
                      containerSx={{
                        px: '22px',
                        py: '22px',
                        mt: '-22px',
                        mx: '-22px',
                      }}
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
