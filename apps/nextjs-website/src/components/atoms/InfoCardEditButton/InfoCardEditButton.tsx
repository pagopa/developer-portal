'use client';
import { useTranslations } from 'next-intl';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';

type InforCardEditButtonProps = {
  // eslint-disable-next-line functional/no-return-void
  onClick?: () => void;
};

const InfoCardEditButton = ({ onClick }: InforCardEditButtonProps) => {
  const t = useTranslations('shared');

  return (
    <Button
      onClick={onClick}
      color='primary'
      sx={{ paddingLeft: 0, paddingRight: 0 }}
      endIcon={<EditIcon sx={{ height: 30 }} />}
    >
      {t('edit')}
    </Button>
  );
};

export default InfoCardEditButton;
