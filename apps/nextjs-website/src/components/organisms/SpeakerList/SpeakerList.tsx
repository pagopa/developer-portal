'use client';
import SpeakerPreview from '@/components/molecules/SpeakerPreview/SpeakerPreview';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Speaker } from '@/lib/types/speaker';
import { Box, Grid, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

type SpeakerListProps = {
  speakers: Speaker[];
};

const SpeakerList = ({ speakers }: SpeakerListProps) => {
  const t = useTranslations('webinar');

  return (
    <EContainer>
      <Box mr={0} ml={{ xs: -1, md: 0 }} mt={5} mb={10} width={'100%'}>
        <Typography
          variant='subtitle1'
          fontWeight={700}
          fontSize={{ xs: 28, md: 32 }}
          style={{ marginTop: 0, marginBottom: 32 }}
          width={{ xs: '100%', md: '60%' }}
        >
          {t('speakersTitle')}
        </Typography>
        <Grid
          flexDirection={{ xs: 'column', md: 'row' }}
          container={true}
          columns={4}
          gap={'2rem'}
        >
          {speakers?.map((speaker, index) => (
            <SpeakerPreview
              key={index}
              name={speaker.name}
              description={speaker.description}
              jobTitle={speaker.jobTitle}
              avatar={speaker.avatar}
              compactMode={false}
            />
          ))}
        </Grid>
      </Box>
    </EContainer>
  );
};

export default SpeakerList;
