'use client';
import React, { useState } from 'react';
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
import { QuestionsAndAnswersItem } from '@/lib/types/webinar';
import BlocksRendererClient from '../BlocksRendererClient/BlocksRendererClient';
import EContainer from '@/editorialComponents/EContainer/EContainer';

const MIN_QUESTIONS_TO_SHOW = 5;
const MAX_QUESTIONS_TO_SHOW = 10;

export type QuestionsAndAnswersProps = {
  readonly items: QuestionsAndAnswersItem[];
};

const QuestionsAndAnswers = ({ items }: QuestionsAndAnswersProps) => {
  const theme = useTheme();
  const t = useTranslations('webinar.webinarsSection.questionsAndAnswers');
  const [showMore, toggleShowMore] = useState(false);
  const questionsToShow = showMore
    ? MAX_QUESTIONS_TO_SHOW
    : MIN_QUESTIONS_TO_SHOW;

  const [expanded, setExpanded] = React.useState<number | false>(false);

  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <Box pt={10} pb={10} sx={{ backgroundColor: theme.palette.grey[50] }}>
      <EContainer>
        <Typography variant='h4' sx={{ mb: 4, width: '100%' }}>
          {t('title')}
        </Typography>
        {[...items].splice(0, questionsToShow).map((question, index) => (
          <Accordion
            sx={{
              marginBottom: 2,
              borderTop: 'none',
              borderRadius: '4px',
              '::before': { display: 'none' },
              width: '100%',
            }}
            key={question.question}
            disableGutters
            expanded={expanded === index}
            onChange={handleChange(index)}
          >
            <AccordionSummary
              expandIcon={<ExpandMore color='primary' sx={{ mr: 1.5 }} />}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '21px',
                  my: 2,
                }}
              >
                {question.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <BlocksRendererClient
                content={question.answer}
                paragraphSx={{ mb: 0, fontSize: '16px', lineHeight: '21px' }}
              />
            </AccordionDetails>
          </Accordion>
        ))}
        {items.length > 5 && (
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Button
              sx={{
                mx: 'auto',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '21px',
              }}
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
        )}
      </EContainer>
    </Box>
  );
};

export default QuestionsAndAnswers;
