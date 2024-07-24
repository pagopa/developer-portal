import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { GuideCard, GuideCardProps } from '../GuideCard/GuideCard';

interface RelatedResourcesProps {
  resources: GuideCardProps[];
}

const RelatedResources = ({ resources }: RelatedResourcesProps) => {
  const t = useTranslations('webinar.webinarsSection.relatedResources');

  return (
    <EContainer>
      <Typography variant='h4' sx={{ mb: 4, width: '100%' }}>
        {t('title')}
      </Typography>
      <Box>
        {resources &&
          resources.map((props, index) => <GuideCard key={index} {...props} />)}
      </Box>
    </EContainer>
  );
};

export default RelatedResources;
