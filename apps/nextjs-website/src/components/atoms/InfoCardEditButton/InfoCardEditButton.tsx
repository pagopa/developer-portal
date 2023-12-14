'use client';
import { useTranslations } from 'next-intl';
import EditIcon from '@mui/icons-material/Edit';
import { ButtonNaked } from '@pagopa/mui-italia';

const InfoCardEditButton = ({ onClick }: { onClick?: () => null }) => {
  const t = useTranslations('shared');

  return (
    <ButtonNaked
      onClick={onClick}
      color='primary'
      sx={{ paddingLeft: 0, paddingRight: 0 }}
      endIcon={<EditIcon sx={{ height: 30 }} />}
    >
      {t('edit')}
    </ButtonNaked>
  );
};

export default InfoCardEditButton;
