'use client';
import { FC } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { UnorderedList } from '@/components/atoms/UnorderedList/UnorderedList';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import { BlocksContent } from '@strapi/blocks-react-renderer';
import BlocksRendererClient from '../BlocksRendererClient/BlocksRendererClient';
import { useTranslations } from 'next-intl';

type Description = {
  readonly listItems?: ReadonlyArray<string>;
  readonly content?: BlocksContent;
  readonly title: string;
};

export type GuideCardProps = {
  description: Description;
  imagePath: string;
  layout?: 'left' | 'center' | 'right';
  link: {
    label: string;
    href: string;
  };
  mobileImagePath: string;
  title: string;
};

export const GuideCard: FC<GuideCardProps> = ({
  description,
  imagePath,
  layout = 'center',
  link,
  mobileImagePath,
  title,
}: GuideCardProps) => {
  const { spacing } = useTheme();
  const t = useTranslations();

  const flexLayoutMap = {
    center: 'center',
    right: 'flex-end',
    left: 'flex-start',
  };

  return (
    <Stack
      py={spacing(0)}
      width='100%'
      justifyContent='center'
      alignItems={flexLayoutMap[layout]}
    >
      <Card
        raised
        sx={{
          borderRadius: 4,
          display: 'flex',
          flexDirection: { xs: 'column-reverse', lg: 'row' },
          marginBottom: 10,
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100%', lg: '50%' },
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              justifyContent: 'space-between',
              padding: '40px',
              '&:last-child': {
                paddingBottom: '40px',
              },
            }}
          >
            <Box>
              <Typography variant='h6' mb={spacing(1.75)}>
                {title}
              </Typography>
              <Typography variant='subtitle2' color='text.primary'>
                {t(description.title)}
              </Typography>
              {description.listItems && (
                <UnorderedList listItems={description.listItems} />
              )}
              {description.content && (
                <BlocksRendererClient content={description.content} />
              )}
            </Box>
            <LinkButton label={t(link.label)} href={link.href}></LinkButton>
          </CardContent>
        </Box>
        <CardMedia
          sx={{
            display: { xs: 'block', lg: 'none' },
            width: { xs: '100%', lg: '50%' },
          }}
          component='img'
          image={mobileImagePath}
          alt={title}
        />
        <CardMedia
          sx={{
            display: { xs: 'none', lg: 'block' },
            width: { xs: '100%', lg: '50%' },
          }}
          component='img'
          image={imagePath}
          alt={title}
        />
      </Card>
    </Stack>
  );
};
