'use client';
import SummaryInformation from '@/components/atoms/SummaryInformation/SummaryInformation';
import { Box, Grid } from '@mui/material';
import { Webinar } from '@/lib/types/webinar';
import { useWebinar } from '@/helpers/webinar.helpers';
import { useEffect, useState } from 'react';
import { getWebinarQuestionList } from '@/lib/webinarApi';
import Spinner from '@/components/atoms/Spinner/Spinner';
import useSWR from 'swr';
import PageNotFound from '@/app/not-found';
import { fetchWebinarsQuestionsIntervalMs } from '@/config';
import { useUser } from '@/helpers/user.helper';
import WebinarQuestionsTable from '@/components/organisms/WebinarQuestionsTable/WebinarQuestionsTable';
import { useTranslations } from 'next-intl';
import { WebinarQuestion } from '@/lib/webinars/webinarQuestions';

type WebinarQuestionsTemplateProps = {
  webinar: Webinar;
};

const WebinarQuestionsTemplate = ({
  webinar,
}: WebinarQuestionsTemplateProps) => {
  const { user, loading } = useUser();
  const { webinarState, setWebinar } = useWebinar();
  const t = useTranslations('webinar.questionList');
  const [questions, setQuestions] = useState<readonly WebinarQuestion[]>([]);

  const { data, error } = useSWR(webinar.slug, getWebinarQuestionList, {
    refreshInterval: fetchWebinarsQuestionsIntervalMs,
  });

  useEffect(() => {
    if (webinar) {
      setWebinar(webinar);
    }
  }, [webinar, setWebinar]);

  useEffect(() => {
    setQuestions(data ?? []);
  }, [data]);

  if (error || (!loading && !user)) return <PageNotFound />;
  else if (!data || loading || !user) return <Spinner />;
  else {
    const userName = `${user.attributes['given_name']} ${user.attributes['family_name']}`;
    const sortedVisibleQuestions = [...questions]
      .sort((a, b) => b.id.createdAt.getTime() - a.id.createdAt.getTime())
      .filter(({ hiddenBy }) => !hiddenBy || userName === hiddenBy);

    const highlightedQuestions = sortedVisibleQuestions.filter(
      (question) => !!question.highlightedBy
    );

    const notHighlightedQuestions = sortedVisibleQuestions.filter(
      (question) => !question.highlightedBy
    );

    const updateLocalQuestionsByDate = (
      createdAt: Date,
      updateHighlight: boolean,
      updateHide: boolean
    ) => {
      setQuestions((oldQuestions) =>
        oldQuestions.map((oldQuestion) => {
          const userName = `${user.attributes['given_name']} ${user.attributes['family_name']}`;
          return createdAt.toISOString() ===
            oldQuestion.id.createdAt.toISOString()
            ? {
                ...oldQuestion,
                hiddenBy: updateHide ? userName : undefined,
                highlightedBy: updateHighlight ? userName : undefined,
              }
            : oldQuestion;
        })
      );

      return null;
    };

    return (
      <>
        <SummaryInformation
          title={webinar.title}
          description={webinar.description}
          startDateTime={webinar.startDateTime}
          endDateTime={webinar.endDateTime}
          webinarState={webinarState}
        >
          <Box
            pb={4}
            width={'100%'}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column-reverse', md: 'row' },
              alignContent: 'space-between',
              gap: 4,
            }}
          >
            <Grid key={'notHighlightedQuestions'} item xs={12} md={6}>
              <WebinarQuestionsTable
                updateLocalQuestions={updateLocalQuestionsByDate}
                userName={userName}
                questions={notHighlightedQuestions}
                title={t('title.questions')}
              />
            </Grid>
            <Grid key={'highlightedQuestions'} item xs={12} md={6}>
              <WebinarQuestionsTable
                updateLocalQuestions={updateLocalQuestionsByDate}
                userName={userName}
                questions={highlightedQuestions}
                title={t('title.highlightedQuestions')}
              />
            </Grid>
          </Box>
        </SummaryInformation>
      </>
    );
  }
};

export default WebinarQuestionsTemplate;
