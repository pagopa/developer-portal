'use client';
import { useTranslations } from 'next-intl';
import EditIcon from '@mui/icons-material/Edit';
import { ButtonNaked } from '@/components/atoms/ButtonNaked/ButtonNaked';

type InforCardEditButtonProps = {
  // eslint-disable-next-line functional/no-return-void
  onClick?: () => void;
};

const InfoCardEditButton = ({ onClick }: InforCardEditButtonProps) => {
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
