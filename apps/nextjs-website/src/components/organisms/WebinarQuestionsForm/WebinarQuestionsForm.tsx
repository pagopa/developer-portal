'use client';
import { snackbarAutoHideDurationMs } from '@/config';
import { sendWebinarQuestion } from '@/lib/webinarApi';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  Card,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import ForumIcon from '@mui/icons-material/Forum';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CheckIcon from '@mui/icons-material/Check';
import { WebinarState } from '@/helpers/webinar.helpers';

const MAX_QUESTION_LENGTH = 240;

type FormState = 'submitting' | 'submitted' | undefined;
type WebinarQuestionsFormProps = {
  // eslint-disable-next-line functional/no-return-void
  toggleFormVisibility: () => void;
  disabled?: boolean;
  webinarSlug: string;
  webinarState: WebinarState;
  isSmallScreen: boolean;
  question: string;
  // eslint-disable-next-line functional/no-return-void
  setQuestion: (text: string) => void;
};

export const WebinarQuestionsForm = ({
  disabled = false,
  webinarSlug,
  toggleFormVisibility,
  isSmallScreen,
  question,
  setQuestion,
}: WebinarQuestionsFormProps) => {
  const t = useTranslations('webinar');
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>();

  const sendQuestion = useCallback(async () => {
    if (!question) return;

    setFormState('submitting');
    return await sendWebinarQuestion({
      slug: webinarSlug,
      question: question,
    });
  }, [webinarSlug, question]);

  const handleSubmit = () => {
    sendQuestion()
      .then(() => {
        setFormState('submitted');
        setQuestion('');
        setTimeout(() => {
          setFormState(undefined);
        }, 3000);
      })
      .catch(() => {
        setFormState(undefined);
        setError(t('questionsForm.error'));
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!question) return;
    // Submit question if user presses Enter + Shift
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const { palette } = useTheme();
  const hasFormState = formState === 'submitting' || formState === 'submitted';
  const btnDisabled = !question || hasFormState || disabled;
  const startIcon = hasFormState ? (
    <CheckIcon sx={{ color: '#6CC66A' }} />
  ) : null;
  const btnLabel =
    formState === 'submitted'
      ? t('questionsForm.submitted')
      : t('questionsForm.submit');

  return (
    <>
      <Card
        elevation={1}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '138px',
          width: isSmallScreen ? '100%' : '303px',
          borderTopRightRadius: isSmallScreen ? 0 : '16px',
          borderBottomRightRadius: '16px',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: isSmallScreen ? '16px' : 0,
          boxShadow: '0px 4px 9px 4px rgba(0, 43, 85, 0.1)',
        }}
      >
        <Button
          startIcon={
            <Stack
              direction='row'
              sx={{
                gap: '8px',
                height: '32px',
                alignItems: 'center',
              }}
            >
              <ForumIcon
                sx={{ color: 'white', width: '32px', height: '32px' }}
              />
              <Typography
                sx={{ color: 'white', fontWeight: 600, fontSize: 18 }}
              >
                {t('questionsForm.questionBox')}
              </Typography>
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
                <ArrowDropUpIcon sx={{ width: '24px', height: '24px' }} />
              ) : (
                <ArrowLeftIcon sx={{ width: '24px', height: '24px' }} />
              )}

              <Typography
                sx={{
                  color: 'white',
                  fontWeight: 400,
                  fontSize: 12,
                }}
              >
                {t('questionsForm.reduce')}
              </Typography>
            </Stack>
          }
          variant='contained'
          onClick={() => toggleFormVisibility()}
          sx={{
            width: '100%',
            paddingX: '16px',
            justifyContent: 'space-between',
            height: isSmallScreen ? '64px' : '60px',
            backgroundColor: palette.primary.main,
            borderTopRightRadius: isSmallScreen ? '0' : '16px',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />
        <Stack
          direction={'column'}
          sx={{
            padding: '16px',
            gap: '24px',
          }}
        >
          {!disabled ? (
            <>
              <Typography
                variant='body2'
                sx={{ fontWeight: 600 }}
                color={(theme) =>
                  disabled
                    ? theme.palette.text.disabled
                    : theme.palette.text.primary
                }
              >
                {t('questionsForm.title', {
                  maxLength: `${MAX_QUESTION_LENGTH}`,
                })}
              </Typography>
              <TextField
                disabled={disabled}
                label={
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 400,
                      color: palette.text.secondary,
                    }}
                  >
                    {t('questionsForm.question')}
                  </Typography>
                }
                size='small'
                multiline
                maxRows={6}
                sx={{ flexGrow: 1, minHeight: '40px' }}
                value={question}
                variant='outlined'
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                inputProps={{
                  maxLength: MAX_QUESTION_LENGTH,
                  sx: { fontSize: 16, fontWeight: 400 },
                }}
                helperText={
                  <Typography
                    component='span'
                    color={(theme) => theme.palette.text.secondary}
                    fontSize={12}
                    fontWeight={600}
                    sx={{ display: 'flex', justifyContent: 'end' }}
                  >
                    {question.length > 0 &&
                      `${question.length} / ${MAX_QUESTION_LENGTH}`}
                  </Typography>
                }
              />
              {question.length > 0 || formState === 'submitted' ? (
                <LoadingButton
                  sx={{
                    alignSelf: 'start',
                    marginTop: formState === 'submitted' ? '-6px' : '-24px',
                    color: 'white',
                    '&.Mui-disabled': {
                      background:
                        formState === 'submitted'
                          ? 'white'
                          : palette.primary.main,
                      color:
                        formState === 'submitted'
                          ? palette.text.secondary
                          : 'white',
                    },
                  }}
                  loadingPosition={hasFormState ? 'start' : undefined}
                  loading={formState === 'submitting'}
                  startIcon={startIcon}
                  disabled={btnDisabled}
                  variant={formState === 'submitted' ? 'text' : 'contained'}
                  onClick={handleSubmit}
                >
                  <span>{btnLabel}</span>
                </LoadingButton>
              ) : null}
            </>
          ) : (
            <Typography
              sx={{
                color: palette.text.disabled,
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: '0.15px',
              }}
            >
              {t('questionsForm.notLive')}
            </Typography>
          )}
        </Stack>
      </Card>

      <Snackbar
        open={!!error}
        autoHideDuration={snackbarAutoHideDurationMs}
        onClose={() => setError(null)}
      >
        <Alert severity={'error'}>{error}</Alert>
      </Snackbar>
    </>
  );
};
