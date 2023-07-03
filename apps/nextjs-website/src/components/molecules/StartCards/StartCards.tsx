import React from 'react';
import { Box, Grid } from '@mui/material';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';
import CtaCard from '@/components/atoms/CtaCard/CtaCard';
import { translations } from '@/_contents/translations';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';

type StartCardsProps = {
  cards: {
    title: string;
    text: string;
    href: string;
    iconName: string;
  }[];
};

const StartCards = ({ cards }: StartCardsProps) => {
  const { shared } = translations;

  return (
    <EContainer>
      <Box pb={4}>
        <Grid container spacing={2}>
          {cards.map(({ title, text, href, iconName }, index) => {
            return (
              <Grid key={index} item xs={12} md>
                <CtaCard
                  minHeight={150}
                  title={title}
                  text={text}
                  cta={{
                    label: shared.moreInfo,
                    href,
                  }}
                  icon={<IconWrapper iconName={iconName} />}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </EContainer>
  );
};

export default StartCards;
