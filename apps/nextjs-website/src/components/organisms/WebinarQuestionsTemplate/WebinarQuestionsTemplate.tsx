'use client';
import SummaryInformation from '@/components/atoms/SummaryInformation/SummaryInformation';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Webinar } from '@/lib/types/webinar';
import { WebinarQuestion } from '@/lib/webinars/webinarQuestions';
import { useWebinar } from '@/helpers/webinar.helpers';
import { useCallback, useEffect } from 'react';
import {
  getWebinarQuestionList,
  hideQuestion,
  highlightQuestion,
} from '@/lib/webinarApi';
import { useTranslations } from 'next-intl';
import Spinner from '@/components/atoms/Spinner/Spinner';
import useSWR from 'swr';
import PageNotFound from '@/app/not-found';
import { fetchWebinarsQuestionsIntervalMs } from '@/config';
import WebinarQuestionTemplate from '../../molecules/WebinarQuestion/WebinarQuestionTemplate';
import { useUser } from '@/helpers/user.helper';

type WebinarQuestionsTemplateProps = {
  webinar: Webinar;
};

const WebinarQuestionsTemplate = ({
  webinar,
}: WebinarQuestionsTemplateProps) => {
  const { user, loading } = useUser();
  const userEmail = user?.attributes['email'] as string;
  const { webinarState, setWebinar } = useWebinar();
  const t = useTranslations('webinar.questionList');

  const { data, error } = useSWR(webinar.slug, getWebinarQuestionList, {
    refreshInterval: fetchWebinarsQuestionsIntervalMs,
  });

  const makeQuestionHighlighted = useCallback(
    (question: WebinarQuestion, highlightedBy: string) =>
      highlightQuestion(question, highlightedBy),
    []
  );

  const makeQuestionHidden = useCallback(
    (question: WebinarQuestion, hiddenBy: string) =>
      hideQuestion(question, hiddenBy),
    []
  );

  useEffect(() => {
    webinar && setWebinar(webinar);
  }, [webinar]);

  if (error) return <PageNotFound />;
  else if (!data || loading) return <Spinner />;
  else {
    const sortedQuestions = [...data].sort(
      (a: WebinarQuestion, b: WebinarQuestion) =>
        b.createdAt.getTime() - a.createdAt.getTime()
    );

    return (
      <>
        <SummaryInformation
          title={webinar.title}
          description={webinar.description}
          startDateTime={webinar.startDateTime}
          endDateTime={webinar.endDateTime}
          webinarState={webinarState}
        >
          <TableContainer component={Paper} sx={{ marginY: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>{t('createdAt')}</TableCell>
                  <TableCell>{t('text')}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedQuestions.map((row) => (
                  <WebinarQuestionTemplate
                    key={row.createdAt.valueOf.toString()}
                    question={row}
                    userEmail={userEmail}
                    onHide={async () =>
                      await makeQuestionHidden(row, userEmail)
                    }
                    onHighlight={async () =>
                      await makeQuestionHighlighted(row, userEmail)
                    }
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </SummaryInformation>
      </>
    );
  }
};

export default WebinarQuestionsTemplate;
