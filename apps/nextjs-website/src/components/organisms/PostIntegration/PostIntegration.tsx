'use client';
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { translations } from '@/_contents/translations';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import {
  GuideCard,
  GuideCardProps,
} from '@/components/molecules/GuideCard/GuideCard';
import LinkCards from '@/components/molecules/LinkCards/LinkCards';

type PostIntegrationProps = {
  title: string;
  subtitle: string;
  cta?: {
    label: string;
    href: string;
  };
  listTitle?: string;
  cards?: {
    title: string;
    text: string;
    href: string;
  }[];
  guides?: GuideCardProps[];
};

const PostIntegration = ({
  title,
  subtitle,
  cta,
  listTitle,
  cards,
  guides,
}: PostIntegrationProps) => {
  const theme = useTheme();
  const { shared } = translations;

  return (
    <Box py={8} sx={{ backgroundColor: theme.palette.background.default }}>
      <SectionTitle margin={0} title={title} subtitle={subtitle} cta={cta}>
        {listTitle && (
          <Typography
            content='div'
            mb={0}
            mt={6}
            color={theme.palette.grey[500]}
            fontSize={14}
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              textTransform: 'uppercase',
            }}
          >
            {listTitle}
          </Typography>
        )}
      </SectionTitle>
      {cards && (
        <EContainer sx={{ margin: 0 }}>
          <LinkCards
            cards={cards.map((card) => ({ ...card, label: shared.goToModel }))}
          />
        </EContainer>
      )}
      {guides && (
        <EContainer>
          <Box mt={5}>
            {guides &&
              guides.map((props, index) => (
                <GuideCard key={index} {...props} />
              ))}
          </Box>
        </EContainer>
      )}
    </Box>
  );
};

export default PostIntegration;
