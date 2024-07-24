import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { GuideCard, GuideCardProps } from '../GuideCard/GuideCard';
import DownloadableDocuments, {
  DownloadableDocumentsProps,
} from '../DownloadableDocuments/DownloadableDocuments';

interface RelatedResourcesProps {
  guide: GuideCardProps;
  downloadableDocuments: DownloadableDocumentsProps['documents'];
}

const RelatedResources = ({
  guide,
  downloadableDocuments,
}: RelatedResourcesProps) => {
  const t = useTranslations('webinar.webinarsSection.relatedResources');

  return (
    <EContainer>
      <Typography variant='h4' sx={{ mt: 8, mb: 4, width: '100%' }}>
        {t('title')}
      </Typography>
      <GuideCard {...guide} />

      <DownloadableDocuments documents={downloadableDocuments} />
    </EContainer>
  );
};

export default RelatedResources;
