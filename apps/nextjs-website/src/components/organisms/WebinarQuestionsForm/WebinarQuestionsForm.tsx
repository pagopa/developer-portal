'use client';
import { snackbarAutoHideDurationMs } from '@/config';
import { sendWebinarQuestion } from '@/lib/webinarApi';
import { Done } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Card, Snackbar, TextField, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

type FormState = 'submitting' | 'submitted' | undefined;
type WebinarQuestionsFormProps = {
  disabled?: boolean;
  webinarSlug: string;
};

export const WebinarQuestionsForm = ({
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
          height: '100%',
          gap: 3,
          p: 3,
        }}
      >
        <Typography
          variant='body2'
          sx={{ fontWeight: 600 }}
          color={(theme) =>
            disabled ? theme.palette.text.disabled : theme.palette.text.primary
          }
        >
          {t('questionsForm.title')}
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
        />
        <LoadingButton
          sx={{ alignSelf: 'start' }}
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
