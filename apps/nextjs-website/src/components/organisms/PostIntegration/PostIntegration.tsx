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
  title?: string;
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
  backgroundVariant?: 'white' | 'lightGrey';
};

const PostIntegration = ({
  title,
  subtitle,
  cta,
  listTitle,
  serviceModels,
  guides,
  backgroundVariant = 'white',
}: PostIntegrationProps) => {
  const theme = useTheme();
  const t = useTranslations();

  const backgroundStyles = {
    white: {
      backgroundColor: theme.palette.background.paper,
      paddingBottom: 0,
    },
    lightGrey: {
      backgroundColor: theme.palette.grey[50],
      paddingBottom: 8,
    },
  };

  return (
    <Box
      sx={{
        paddingTop: 8,
        ...backgroundStyles[backgroundVariant],
      }}
    >
      <SectionTitle
        margin={0}
        title={title || t('overview.postIntegration.title')}
        subtitle={subtitle}
        link={cta ? { text: cta.label, url: cta.href } : undefined}
        variant='h2'
      />
      <EContainer>
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
      </EContainer>
      {serviceModels && serviceModels.length > 0 && (
        <EContainer sx={{ margin: 0 }}>
          <LinkCards
            cards={serviceModels.map((serviceModel) => ({
              ...serviceModel,
              label: t('shared.goToModel'),
            }))}
          />
        </EContainer>
      )}
      {guides && guides.length > 0 && (
        <EContainer>
          <Box sx={{ marginTop: 5, width: '100%' }}>
            {guides &&
              guides.map((props, index) => (
                <GuideCard
                  key={index}
                  {...props}
                  description={{
                    title: props.description.translate
                      ? t(props.description.title)
                      : props.description.title,
                    content: props.description.content,
                    listItems: props.description.listItems,
                  }}
                  link={{
                    label: props.link.translate
                      ? t(props.link.label)
                      : props.link.label,
                    href: props.link.href,
                  }}
                />
              ))}
          </Box>
        </EContainer>
      )}
    </Box>
  );
};

export default PostIntegration;
