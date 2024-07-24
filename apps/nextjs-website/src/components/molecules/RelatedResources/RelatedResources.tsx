import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { GuideCard, GuideCardProps } from '../GuideCard/GuideCard';
import CardsGrid from '../CardsGrid/CardsGrid';

interface RelatedResourcesProps {
  guide: GuideCardProps;
}

const RelatedResources = ({ guide }: RelatedResourcesProps) => {
  const t = useTranslations('webinar.webinarsSection.relatedResources');

  return (
    <EContainer>
      <Typography variant='h4' sx={{ mb: 4, width: '100%' }}>
        {t('title')}
      </Typography>
      <GuideCard {...guide} />
    </EContainer>
  );
};

export default RelatedResources;
