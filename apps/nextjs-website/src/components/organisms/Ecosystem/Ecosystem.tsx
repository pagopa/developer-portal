'use client';
import React from 'react';
import { Box, useTheme } from '@mui/material';
import TabComponent from '@/components/atoms/TabComponent/TabComponent';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import Link from 'next/link';
import { HomepageProps } from '@/app/[locale]/page';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { ButtonNaked } from '@/components/atoms/ButtonNaked/ButtonNaked';

const TabContent: React.FC<
  Pick<
    Required<HomepageProps>['ecosystem']['tabContents'][number],
    'items' | 'cta'
  >
> = ({ items, cta }) => (
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
);

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
              content: <TabContent items={items} cta={cta} />,
            }))}
            variant='fullWidth'
            centered
            sx={{ px: 0 }}
          />
        ) : (
          <TabContent items={tabContents[0].items} cta={tabContents[0].cta} />
        )}
      </Box>
    </Box>
  );
};

export default Ecosystem;
