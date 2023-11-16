'use client';
import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import EditIcon from '@mui/icons-material/Edit';

const InfoCardEditButton = ({ onClick }: { onClick?: () => null }) => {
  const t = useTranslations('shared');

  return (
    <Button
      onClick={onClick}
      sx={{ paddingLeft: 0, paddingRight: 0 }}
      variant='text'
      endIcon={<EditIcon sx={{ height: 30 }} />}
    >
      {t('edit')}
    </Button>
  );
};

export default InfoCardEditButton;
