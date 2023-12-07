import { Webinar } from '@/lib/types/webinar';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Box, useTheme } from '@mui/material';
import VimeoPlayer from '@/components/atoms/VimeoPlayer/VimeoPlayer';
import { WebinarQuestionsForm } from '@/components/organisms/WebinarQuestionsForm/WebinarQuestionsForm';
import { DevPortalUser } from '@/lib/types/auth';

type WebinarPlayerSectionProps = {
  webinar: Webinar;
  user: DevPortalUser;
};
const WebinarPlayerSection = ({ webinar, user }: WebinarPlayerSectionProps) => {
  const { palette } = useTheme();

  return (
    webinar.playerSrc && (
      <div style={{ backgroundColor: palette.grey[50] }}>
        <EContainer>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'left',
              alignContent: 'stretch',
              flexGrow: 1,
              gap: 3,
              marginBottom: 10,
            }}
          >
            <Box sx={{ width: { md: '66%' } }}>
              <VimeoPlayer playerSrc={webinar.playerSrc} />
            </Box>
            <Box>
              <WebinarQuestionsForm webinarSlug={webinar.slug} user={user} />
            </Box>
          </Box>
        </EContainer>
      </div>
    )
  );
};

export default WebinarPlayerSection;
