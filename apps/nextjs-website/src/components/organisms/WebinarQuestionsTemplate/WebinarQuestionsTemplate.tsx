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
import { useEffect, useState } from 'react';
import { getWebinarQuestionList } from '@/lib/webinarApi';
import { useRouter } from 'next/navigation';
import { useFormatter } from 'next-intl';
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

  const fetchQuestions = async () => {
    const data = await getWebinarQuestionList(webinar.slug).catch(() => {
      router.replace('/404');
      return [];
    });

    const sortedQuestions = [...data].sort(
      (a: WebinarQuestion, b: WebinarQuestion) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setQuestions(sortedQuestions);
    setLoading(false);
  };

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
                <TableCell>Ora creazione</TableCell>
                <TableCell>Domanda</TableCell>
                <TableCell>Utente</TableCell>
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
                  <TableCell width='70%'>
                    {DOMPurify.sanitize(row.question)}
                  </TableCell>
                  <TableCell>
                    {row.givenName} {row.familyName}
                  </TableCell>
                  <TableCell>
                    <CopyToClipboardButton
                      value={row.question}
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
