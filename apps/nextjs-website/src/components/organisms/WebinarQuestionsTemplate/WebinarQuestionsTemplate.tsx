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
import { useCallback, useEffect, useState } from 'react';
import { getWebinarQuestionList } from '@/lib/webinarApi';
import { useRouter } from 'next/navigation';
import { useFormatter, useTranslations } from 'next-intl';
import { CopyToClipboardButton } from '@pagopa/mui-italia';
import DOMPurify from 'isomorphic-dompurify';
import Spinner from '@/components/atoms/Spinner/Spinner';

type WebinarQuestionsTemplateProps = {
  webinar: Webinar;
};

const WebinarQuestionsTemplate = ({
  webinar,
}: WebinarQuestionsTemplateProps) => {
  const router = useRouter();
  const formatter = useFormatter();
  const [loading, setLoading] = useState<boolean>(true);
  const [questions, setQuestions] = useState<WebinarQuestion[]>([]);
  const { webinarState, setWebinar } = useWebinar();
  const t = useTranslations('webinar.questionList');

  const fetchQuestions = useCallback(() => {
    getWebinarQuestionList(webinar.slug)
      .then((data) => {
        const sortedQuestions = [...data].sort(
          (a: WebinarQuestion, b: WebinarQuestion) =>
            b.createdAt.getTime() - a.createdAt.getTime()
        );
        setQuestions(sortedQuestions);
        setLoading(false);
      })
      .catch(() => {
        router.replace('/404');
        return [];
      });
  }, [router, webinar.slug]);

  useEffect(() => {
    fetchQuestions();
    const intervalId = setInterval(fetchQuestions, 1_000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    webinar && setWebinar(webinar);
  }, [webinar]);

  return loading ? (
    <Spinner />
  ) : (
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
                <TableCell>{t('user')}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((row) => (
                <TableRow
                  hover
                  key={row.createdAt.toJSON()}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    {formatter.dateTime(row.createdAt, {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </TableCell>
                  <TableCell width='70%'>{row.question}</TableCell>
                  <TableCell>
                    {row.givenName} {row.familyName}
                  </TableCell>
                  <TableCell>
                    <CopyToClipboardButton
                      value={DOMPurify.sanitize(row.question)}
                    ></CopyToClipboardButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SummaryInformation>
    </>
  );
};

export default WebinarQuestionsTemplate;
