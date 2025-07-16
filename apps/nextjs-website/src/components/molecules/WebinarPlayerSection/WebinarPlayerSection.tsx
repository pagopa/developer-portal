import { Webinar } from '@/lib/types/webinar';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import VimeoPlayer from '@/components/atoms/VimeoPlayer/VimeoPlayer';
import { WebinarQuestionsForm } from '@/components/organisms/WebinarQuestionsForm/WebinarQuestionsForm';
import { WebinarState } from '@/helpers/webinar.helpers';
import { useState } from 'react';
import ForumIcon from '@mui/icons-material/Forum';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Stack } from '@mui/system';
import { useTranslations } from 'next-intl';

type WebinarPlayerSectionProps = {
  webinar: Webinar;
  webinarState: WebinarState;
};
const WebinarPlayerSection = ({
  webinar,
  webinarState,
}: WebinarPlayerSectionProps) => {
  const t = useTranslations('webinar');
  const { palette } = useTheme();
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');
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
            {webinarState === WebinarState.live ||
            webinarState === WebinarState.comingSoon ? (
              showQuestionForm ? (
                <Box>
                  <WebinarQuestionsForm
                    interaction={() => {
                      setShowQuestionForm(false);
                    }}
                    webinarSlug={webinar.slug}
                    disabled={webinarState != WebinarState.live}
                    isSmallScreen={isSmallScreen}
                  />
                </Box>
              ) : (
                <Button
                  startIcon={
                    <Stack
                      direction='row'
                      sx={{
                        alignItems: 'center',
                        gap: isSmallScreen ? '8px' : '0',
                      }}
                    >
                      <ForumIcon
                        style={{
                          width: '32px',
                          height: '32px',
                        }}
                      />
                      {isSmallScreen ? (
                        <Typography
                          fontWeight={'600'}
                          fontSize={'18px'}
                          color={'white'}
                        >
                          {t('questionsForm.questionBox')}
                        </Typography>
                      ) : null}
                    </Stack>
                  }
                  endIcon={
                    <Stack
                      direction='row'
                      sx={{
                        alignItems: 'center',
                        margin: 0,
                      }}
                    >
                      {isSmallScreen ? (
                        <ArrowDropDownIcon
                          style={{ width: '24px', height: '24px' }}
                        />
                      ) : (
                        <ArrowRightIcon
                          style={{ width: '24px', height: '24px' }}
                        />
                      )}
                      {isSmallScreen ? (
                        <Typography
                          sx={{
                            color: 'white',
                            fontWeight: 400,
                            fontSize: 12,
                          }}
                        >
                          {t('questionsForm.expand')}
                        </Typography>
                      ) : null}
                    </Stack>
                  }
                  variant='contained'
                  onClick={() => setShowQuestionForm(true)}
                  sx={{
                    paddingX: '16px',
                    justifyContent: 'space-between',
                    width: isSmallScreen ? '100%' : '96px',
                    height: '64px',
                    borderTopRightRadius: isSmallScreen ? 0 : '16px',
                    borderBottomRightRadius: '16px',
                    borderBottomLeftRadius: isSmallScreen ? '16px' : 0,
                    borderTopLeftRadius: 0,
                    backgroundColor: palette.primary.main,
                    boxShadow: '6px 4px 9px 4px rgba(0, 43, 85, 0.1)',
                  }}
                />
              )
            ) : null}
          </Box>
        </EContainer>
      </div>
    )
  );
};

export default WebinarPlayerSection;
