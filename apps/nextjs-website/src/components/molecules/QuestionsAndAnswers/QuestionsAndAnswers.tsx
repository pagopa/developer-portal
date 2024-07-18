'use client';
import React, { useState } from 'react';
import SectionTitle from '../SectionTitle/SectionTitle';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
  useTheme,
} from '@mui/material';
import { Compress, Expand, ExpandMore } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { QuestionsAndAnswers } from '@/lib/types/webinar';
import BlocksRendererClient from '../BlocksRendererClient/BlocksRendererClient';

export type QuestionsAndAnswersProps = {
  readonly questions: QuestionsAndAnswers[];
};

const QuestionsAndAnswersComponent = ({
  questions,
}: QuestionsAndAnswersProps) => {
  const theme = useTheme();
  const t = useTranslations('webinar.webinarsSection.questionsAndAnswers');
  const [showMore, toggleShowMore] = useState(false);
  const questionsToShow = showMore ? 10 : 5;

  return (
    <Box pt={10} pb={10} sx={{ backgroundColor: theme.palette.grey[50] }}>
      <Box sx={{ maxWidth: '1200px', margin: 'auto' }}>
        <Typography variant='h4' sx={{ mb: 4, width: '100%' }}>
          {t('title')}
        </Typography>
        {[...questions].splice(0, questionsToShow).map((question) => (
          <Accordion
            sx={{ marginBottom: 2, borderTop: 'none' }}
            key={question.question}
            disableGutters
          >
            <AccordionSummary expandIcon={<ExpandMore color='primary' />}>
              <Typography>{question.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <BlocksRendererClient content={question.answer} />
            </AccordionDetails>
          </Accordion>
        ))}
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Button
            sx={{ mx: 'auto' }}
            onClick={() => toggleShowMore((prev) => !prev)}
          >
            {showMore ? t('showLess') : t('showMore')}
            {showMore ? (
              <Compress sx={{ ml: 1, height: '20px', width: '20px' }} />
            ) : (
              <Expand sx={{ ml: 1, height: '20px', width: '20px' }} />
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionsAndAnswersComponent;
