import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { GuideCard, GuideCardProps } from '../GuideCard/GuideCard';
import DownloadableDocuments, {
  DownloadableDocumentsProps,
} from '@/components/molecules/DownloadableDocuments/DownloadableDocuments';

interface RelatedResourcesProps {
  title?: string;
  resources: GuideCardProps[];
  downloadableDocuments: DownloadableDocumentsProps['documents'];
}

const RelatedResources = ({
  title,
  resources,
  downloadableDocuments,
}: RelatedResourcesProps) => {
  const t = useTranslations();

  return (
    <EContainer containerSx={{ paddingBottom: '48px' }}>
      <Typography variant='h4' sx={{ mt: 8, mb: 4, width: '100%' }}>
        {title || t('webinar.webinarsSection.relatedResources.title')}
      </Typography>
      <Box>
        {resources &&
          resources.map((props, index) => <GuideCard key={index} {...props} />)}
      </Box>
      <DownloadableDocuments documents={downloadableDocuments} />
    </EContainer>
  );
};

export default RelatedResources;
