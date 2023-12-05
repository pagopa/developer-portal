import { Done } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Card, TextField, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const sendQuestion = (question: string) => {
  return new Promise((resolve) => {
    console.log(question);
    setTimeout(() => {
      resolve('ok');
    }, 3000);
  });
};

type FormState = 'submitting' | 'submitted' | undefined;

export const WebinarQuestionsForm = () => {
  const t = useTranslations('webinar');
  const [question, setQuestion] = useState('');
  const [formState, setFormState] = useState<FormState>();

  const handleSubmit = () => {
    if (!question) return;
    setFormState('submitting');
    sendQuestion(question).then(() => {
      setFormState('submitted');
      setQuestion('');
      setTimeout(() => {
        setFormState(undefined);
      }, 3000);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const hasFormState = formState === 'submitting' || formState === 'submitted';
  const disabled = !question || hasFormState;
  const startIcon = hasFormState ? <Done /> : null;
  const btnLabel =
    formState === 'submitted'
      ? t('questionsForm.submitted')
      : t('questionsForm.submit');

  return (
    <Card
      elevation={1}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}
    >
      <Typography variant='body2' sx={{ fontWeight: 600 }}>
        {t('questionsForm.title')}
      </Typography>

      <TextField
        value={question}
        label={t('questionsForm.question')}
        multiline
        maxRows={6}
        variant='outlined'
        onChange={handleChange}
      />
      <LoadingButton
        sx={{ alignSelf: 'start' }}
        color='primary'
        loadingPosition={hasFormState ? 'start' : undefined}
        loading={formState === 'submitting'}
        startIcon={startIcon}
        disabled={disabled}
        variant='contained'
        onClick={handleSubmit}
      >
        <span>{btnLabel}</span>
      </LoadingButton>
    </Card>
  );
};
