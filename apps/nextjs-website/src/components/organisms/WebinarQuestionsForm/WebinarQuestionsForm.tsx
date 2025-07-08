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
  onClick?: () => void;
  disabled?: boolean;
  webinarSlug: string;
};

export const WebinarQuestionsForm = ({
  onClick = () => {
    return;
  },
  disabled = false,
  webinarSlug,
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
          minHeight: '200px',
          width: '303px',
          gap: 3,
          borderTopRightRadius: '16px',
          borderBottomRightRadius: '16px',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
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
          <Typography sx={{ color: 'white' }}>Question box</Typography>
          <Button
            startIcon={<ArrowLeftIcon width={'32px'} height={'32px'} />}
            onClick={() => onClick()}
            sx={{ color: 'white' }}
          >
            Riduci
          </Button>
        </Stack>
        <Typography
          variant='body2'
          sx={{ fontWeight: 600 }}
          color={(theme) =>
            disabled ? theme.palette.text.disabled : theme.palette.text.primary
          }
        >
          {t('questionsForm.title', { maxLength: `${MAX_QUESTION_LENGTH}` })}
        </Typography>

        <TextField
          disabled={disabled}
          label={t('questionsForm.question')}
          multiline
          maxRows={6}
          sx={{ flexGrow: 1 }}
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
              fontWeight={400}
              sx={{ display: 'flex', justifyContent: 'end' }}
            >
              {question.length > 0 &&
                `${question.length} / ${MAX_QUESTION_LENGTH}`}
            </Typography>
          }
        />
        <LoadingButton
          sx={{ alignSelf: 'end' }}
          color='primary'
          loadingPosition={hasFormState ? 'start' : undefined}
          loading={formState === 'submitting'}
          startIcon={startIcon}
          disabled={btnDisabled}
          variant='contained'
          onClick={handleSubmit}
        >
          <span>{btnLabel}</span>
        </LoadingButton>
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
