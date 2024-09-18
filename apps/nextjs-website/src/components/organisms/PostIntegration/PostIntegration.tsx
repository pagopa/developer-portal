'use client';
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { useTranslations } from 'next-intl';
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
  serviceModels?: {
    title: string;
    description: string;
    href: string;
  }[];
  guides?: GuideCardProps[];
};

const PostIntegration = ({
  title,
  subtitle,
  cta,
  listTitle,
  serviceModels,
  guides,
}: PostIntegrationProps) => {
  const theme = useTheme();
  const t = useTranslations();

  return (
    <Box py={8} sx={{ backgroundColor: theme.palette.grey[50] }}>
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
      {serviceModels && (
        <EContainer sx={{ margin: 0 }}>
          <LinkCards
            cards={serviceModels.map((serviceModel) => ({
              ...serviceModel,
              label: t('shared.goToModel'),
            }))}
          />
        </EContainer>
      )}
      {guides && (
        <EContainer>
          <Box sx={{ marginTop: 5, width: '100%' }}>
            {guides &&
              guides.map((props, index) => (
                <GuideCard
                  key={index}
                  {...props}
                  description={{
                    title: t(props.description.title),
                    content: props.description.content,
                    listItems: props.description.listItems,
                  }}
                  link={{ label: t(props.link.label), href: props.link.href }}
                />
              ))}
          </Box>
        </EContainer>
      )}
    </Box>
  );
};

export default PostIntegration;
