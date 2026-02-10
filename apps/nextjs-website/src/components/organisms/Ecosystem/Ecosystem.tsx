'use client';
import React from 'react';
import { Box, useTheme } from '@mui/material';
import TabComponent from '@/components/atoms/TabComponent/TabComponent';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import Link from 'next/link';
import { HomepageProps } from '@/app/[locale]/page';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { ButtonNaked } from '@/components/atoms/ButtonNaked/ButtonNaked';

const Ecosystem = ({
  title,
  tabContents,
}: Required<HomepageProps>['ecosystem']) => {
  const theme = useTheme();

  if (!tabContents || tabContents.length === 0) {
    return null;
  }

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
        {tabContents.length > 1 ? (
          <TabComponent
            items={tabContents.map(({ name, items, cta }) => ({
              title: name,
              content: (
                <>
                  {items && (
                    <CardsGrid
                      ctaButtonsVariant={'contained'}
                      cards={items}
                      containerSx={{
                        px: '22px',
                        py: '22px',
                        mt: '-22px',
                        mx: '-22px',
                      }}
                    />
                  )}
                  {cta && (
                    <Box textAlign={'center'}>
                      <ButtonNaked
                        component={Link}
                        href={cta.link.href}
                        color={'primary'}
                        variant={cta.variant || 'contained'}
                        sx={{ mb: 3 }}
                        target={cta.link.target ?? '_self'}
                      >
                        {cta.link.text}
                      </ButtonNaked>
                    </Box>
                  )}
                </>
              ),
            }))}
            variant='fullWidth'
            centered
            sx={{ px: 0 }}
          />
        ) : (
          <>
            {tabContents[0].items && (
              <CardsGrid
                ctaButtonsVariant={'contained'}
                cards={tabContents[0].items}
                containerSx={{
                  px: '22px',
                  py: '22px',
                  mt: '-22px',
                  mx: '-22px',
                }}
              />
            )}
            {tabContents[0].cta && (
              <Box textAlign={'center'}>
                <ButtonNaked
                  component={Link}
                  href={tabContents[0].cta.link.href}
                  color={'primary'}
                  variant={tabContents[0].cta.variant || 'contained'}
                  sx={{ mb: 3 }}
                  target={tabContents[0].cta.link.target ?? '_self'}
                >
                  {tabContents[0].cta.link.text}
                </ButtonNaked>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Ecosystem;
