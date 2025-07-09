'use client';
import { snackbarAutoHideDurationMs } from '@/config';
import { sendWebinarQuestion } from '@/lib/webinarApi';
import { Done } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
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

const MAX_QUESTION_LENGTH = 240;

type FormState = 'submitting' | 'submitted' | undefined;
type WebinarQuestionsFormProps = {
  // eslint-disable-next-line functional/no-return-void
  interaction: () => void;
  disabled?: boolean;
  webinarSlug: string;
};

export const WebinarQuestionsForm = ({
  disabled = false,
  webinarSlug,
  interaction,
}: WebinarQuestionsFormProps) => {
  const t = useTranslations('webinar');
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
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
  const startIcon = hasFormState ? <Done /> : null;
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
          minHeight: '264px',
          width: '303px',
          borderTopRightRadius: '16px',
          borderBottomRightRadius: '16px',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          boxShadow: '0px 4px 9px 4px rgba(0, 43, 85, 0.1)',
        }}
      >
        <Stack
          direction='row'
          sx={{
            p: '16px',
            gap: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '60px',
            backgroundColor: palette.primary.main,
            borderTopRightRadius: '16px',
          }}
        >
          <ForumIcon width={'32px'} height={'32px'} sx={{ color: 'white' }} />
          <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 18 }}>
            Question box
          </Typography>
          <Box width={'50px'} />
          <Button
            startIcon={<ArrowLeftIcon width={'32px'} height={'32px'} />}
            onClick={() => interaction()}
            sx={{ color: 'white', width: '55px' }}
          >
            Riduci
          </Button>
        </Stack>
        <Stack
          direction={'column'}
          sx={{
            padding: '16px',
            gap: '24px',
          }}
        >
          <Typography
            variant='body2'
            sx={{ fontWeight: 600 }}
            color={(theme) =>
              disabled
                ? theme.palette.text.disabled
                : theme.palette.text.primary
            }
          >
            {t('questionsForm.title', { maxLength: `${MAX_QUESTION_LENGTH}` })}
          </Typography>

          <TextField
            disabled={disabled}
            label={t('questionsForm.question')}
            multiline
            maxRows={6}
            sx={{ flexGrow: 1, minHeight: '40px' }}
            value={question}
            variant='outlined'
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            inputProps={{ maxLength: MAX_QUESTION_LENGTH }}
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
          <LoadingButton
            sx={{ alignSelf: 'start' }}
            color='primary'
            loadingPosition={hasFormState ? 'start' : undefined}
            loading={formState === 'submitting'}
            startIcon={startIcon}
            disabled={btnDisabled}
            variant={formState === 'submitted' ? 'text' : 'contained'}
            onClick={handleSubmit}
          >
            <span>{btnLabel}</span>
          </LoadingButton>
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
