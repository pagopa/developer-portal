import { FC } from 'react';
import {
  GuideCard,
  GuideCardProps,
} from '@/components/atoms/GuideCard/GuideCard';
import { Typography, useTheme } from '@mui/material';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';

export type GuidesSectionProps = {
  title: string;
  guides: GuideCardProps[];
};

export const GuidesSection: FC<GuidesSectionProps> = ({
  title,
  guides,
}: GuidesSectionProps) => {
  const { typography } = useTheme();

  return (
    <EContainer background={'#FAFAFA'} py={0}>
      <Typography
        content='div'
        mb={3}
        mt={6}
        color={'#5C6F82'}
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
