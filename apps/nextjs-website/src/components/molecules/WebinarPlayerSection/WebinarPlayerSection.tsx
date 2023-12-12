import { Webinar } from '@/lib/types/webinar';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Box, useTheme } from '@mui/material';
import VimeoPlayer from '@/components/atoms/VimeoPlayer/VimeoPlayer';
import { WebinarQuestionsForm } from '@/components/organisms/WebinarQuestionsForm/WebinarQuestionsForm';
import { DevPortalUser } from '@/lib/types/auth';
import { WebinarState } from '@/helpers/webinar.helpers';
import { useMemo } from 'react';

type WebinarPlayerSectionProps = {
  webinar: Webinar;
  user: DevPortalUser;
  webinarState: WebinarState;
};
const WebinarPlayerSection = ({
  webinar,
  user,
  webinarState,
}: WebinarPlayerSectionProps) => {
  const { palette } = useTheme();

  const showQuestionForm = useMemo(
    () => [WebinarState.live, WebinarState.comingSoon].includes(webinarState),
    [webinarState]
  );

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
            <Box
              sx={{
                width: {
                  md: showQuestionForm ? '66%' : '100%',
                },
              }}
            >
              <VimeoPlayer playerSrc={webinar.playerSrc} />
            </Box>
            {showQuestionForm && (
              <Box>
                <WebinarQuestionsForm
                  webinarSlug={webinar.slug}
                  user={user}
                  disabled={webinarState === WebinarState.comingSoon}
                />
              </Box>
            )}
          </Box>
        </EContainer>
      </div>
    )
  );
};

export default WebinarPlayerSection;
