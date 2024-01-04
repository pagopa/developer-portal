'use client';
import { FC } from 'react';
import {
  GuideCard,
  GuideCardProps,
} from '@/components/molecules/GuideCard/GuideCard';
import { Typography, useTheme } from '@mui/material';
import EContainer from '@/editorialComponents/EContainer/EContainer';

export type GuidesSectionProps = {
  title: string;
  guides: GuideCardProps[];
};

export const GuidesSection: FC<GuidesSectionProps> = ({
  title,
  guides,
}: GuidesSectionProps) => {
  const { typography, palette } = useTheme();

  return (
    <EContainer background={palette.background.default} py={0}>
      <Typography
        content='div'
        mb={3}
        mt={6}
        color={palette.action.active}
        fontSize={14}
        sx={{
          fontWeight: typography.fontWeightBold,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Typography>
      {guides &&
        guides.map((props, index) => <GuideCard key={index} {...props} />)}
    </EContainer>
  );
};
