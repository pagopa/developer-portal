import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { GuideCard, GuideCardProps } from '../GuideCard/GuideCard';
import DownloadableDocuments, {
  DownloadableDocumentsProps,
} from '@/components/molecules/DownloadableDocuments/DownloadableDocuments';

interface RelatedResourcesProps {
  resources: GuideCardProps[];
  downloadableDocuments: DownloadableDocumentsProps['documents'];
}

const RelatedResources = ({
  resources,
  downloadableDocuments,
}: RelatedResourcesProps) => {
  const t = useTranslations('webinar.webinarsSection.relatedResources');

  return (
    <EContainer>
      <Typography variant='h4' sx={{ mt: 8, mb: 4, width: '100%' }}>
        {t('title')}
      </Typography>
      {resources &&
          resources.map((props, index) => <GuideCard key={index} {...props} />)}
      <DownloadableDocuments documents={downloadableDocuments} />
    </EContainer>
  );
};

export default RelatedResources;
