import ConfirmationModal from '@/components/atoms/ConfirmationModal/ConfirmationModal';
import { DevPortalUser } from '@/lib/types/auth';
import { Box, Typography, useTheme } from '@mui/material';
import { ButtonNaked } from '@/components/atoms/ButtonNaked/ButtonNaked';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Auth } from 'aws-amplify';

type DeleteSectionProps = {
  user: DevPortalUser | null;
};

const DeleteSection = ({ user }: DeleteSectionProps) => {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const t = useTranslations('profile');
  const sharedTranslate = useTranslations('shared');
  const { palette } = useTheme();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteUser = useCallback(async () => {
    if (user) {
      setDeleting(true);
      await Auth.deleteUser()
        .then(() => {
          // eslint-disable-next-line functional/immutable-data
          router.push(`/${locale}`);
          setDeleting(false);
        })
        .catch(() => {
          setDeleting(false);
        });
    }
    return null;
  }, [user, router, locale]);

  return (
    <Box display={'flex'} flexDirection={'column'} maxWidth={'900px'}>
      <Typography
        variant='h6'
        sx={{
          marginBottom: '24px',
          fontSize: '16px !important',
          fontWeight: '600',
        }}
      >
        {t('personalData.deleteAccountSection')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: '10px', md: '100px' },
        }}
      >
        <Typography
          variant='body2'
          sx={{
            fontSize: '14px',
            color: palette.text.secondary,
          }}
        >
          {t('personalData.deleteAccount.sectionLabel')}
        </Typography>
        <Box sx={{ margin: 0, padding: 0 }}>
          <ButtonNaked
            component={'button'}
            onClick={() => setOpenDeleteModal(true)}
            color='error'
            variant='text'
            sx={{ whiteSpace: 'nowrap', color: palette.error.dark }}
          >
            {t('personalData.deleteAccount.buttonLabel')}
          </ButtonNaked>
        </Box>
        <ConfirmationModal
          title={t('personalData.deleteAccount.modalTitle')}
          text={t('personalData.deleteAccount.modalText')}
          open={openDeleteModal}
          cancelCta={{
            onClick: () => {
              setOpenDeleteModal(false);
              return null;
            },
            disabled: deleting,
            label: sharedTranslate('cancel'),
          }}
          confirmCta={{
            onClick: () => {
              deleteUser();
              return null;
            },
            disabled: deleting,
            label: t('personalData.deleteAccount.buttonLabel'),
          }}
          setOpen={(value: boolean) => {
            setOpenDeleteModal(value);
            return null;
          }}
        />
      </Box>
    </Box>
  );
};

export default DeleteSection;
