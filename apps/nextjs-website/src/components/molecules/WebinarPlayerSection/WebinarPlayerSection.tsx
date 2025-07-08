import { Webinar } from '@/lib/types/webinar';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Box, Button, useTheme } from '@mui/material';
import VimeoPlayer from '@/components/atoms/VimeoPlayer/VimeoPlayer';
import { WebinarQuestionsForm } from '@/components/organisms/WebinarQuestionsForm/WebinarQuestionsForm';
import { WebinarState } from '@/helpers/webinar.helpers';
import { useMemo, useState } from 'react';
import ForumIcon from '@mui/icons-material/Forum';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

type WebinarPlayerSectionProps = {
  webinar: Webinar;
  webinarState: WebinarState;
};
const WebinarPlayerSection = ({
  webinar,
  webinarState,
}: WebinarPlayerSectionProps) => {
  const { palette } = useTheme();

  const [showQuestionForm, setShowQuestionForm] = useState(false);

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
              gap: 0,
              marginBottom: 10,
            }}
          >
            <Box
              sx={{
                width: {
                  md: showQuestionForm ? '80%' : '100%',
                },
              }}
            >
              <VimeoPlayer playerSrc={webinar.playerSrc} />
            </Box>
            {showQuestionForm ? (
              <Box>
                <WebinarQuestionsForm
                  onClick={() => {
                    setShowQuestionForm(false);
                  }}
                  webinarSlug={webinar.slug}
                  disabled={webinarState === WebinarState.comingSoon}
                />
              </Box>
            ) : (
              <Button
                startIcon={<ForumIcon width={'32px'} height={'32px'} />}
                endIcon={<ArrowRightIcon width={'32px'} height={'32px'} />}
                variant='contained'
                onClick={() => setShowQuestionForm(true)}
                sx={{
                  width: '96px',
                  height: '64px',
                  borderTopRightRadius: '16px',
                  borderBottomRightRadius: '16px',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  backgroundColor: palette.primary.main,
                }}
              />
            )}
          </Box>
        </EContainer>
      </div>
    )
  );
};

export default WebinarPlayerSection;
