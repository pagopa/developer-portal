'use client';
import SpeakerPreview from '@/components/molecules/SpeakerPreview/SpeakerPreview';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Speaker } from '@/lib/types/speaker';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

type SpeakerListProps = {
  speakers: Speaker[];
};

const SpeakerList = ({ speakers }: SpeakerListProps) => {
  const t = useTranslations('webinar');

  return (
    <EContainer>
      <Box mt={5} mb={10}>
        <Typography
          variant='subtitle1'
          fontWeight={600}
          fontSize={{ xs: 20, md: 24 }}
          style={{ marginTop: 0, marginBottom: 32 }}
          marginBottom={2}
          width={{ xs: '100%', md: '60%' }}
        >
          {t('speakersTitle')}
        </Typography>
        <Stack direction='column' gap={4}>
          {speakers?.map((speaker, index) => (
            <SpeakerPreview
              key={index}
              name={speaker.name}
              description={speaker.description}
              jobTitle={speaker.jobTitle}
              imagePath={speaker.imagePath}
              compactMode={false}
            />
          ))}
        </Stack>
      </Box>
    </EContainer>
  );
};

export default SpeakerList;
