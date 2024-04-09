import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import WebinarQuestionRow from '@/components/molecules/WebinarQuestion/WebinarQuestionRow';
import { updateWebinarQuestion } from '@/lib/webinarApi';
import { WebinarQuestion } from '@/lib/webinars/webinarQuestions';

type WebinarQuestionsTableProps = {
  userName: string;
  questions: WebinarQuestion[];
  title: string;
  updateLocalQuestions: (
    createdAt: Date,
    highlight: boolean,
    hidden: boolean
  ) => null;
};

const WebinarQuestionsTable = ({
  userName,
  questions,
  title,
  updateLocalQuestions,
}: WebinarQuestionsTableProps) => {
  return (
    <TableContainer component={Paper} sx={{ marginY: 2 }}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>{title}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question) => (
            <WebinarQuestionRow
              key={question.id.createdAt.toISOString()}
              question={question}
              userName={userName}
              onHide={async (hide) => {
                updateLocalQuestions(
                  question.id.createdAt,
                  !!question.highlightedBy,
                  hide
                );
                await updateWebinarQuestion({
                  id: question.id,
                  updates: {
                    hiddenBy: hide
                      ? { operation: 'update', value: userName }
                      : { operation: 'remove' },
                  },
                });
              }}
              onHighlight={async (highlight) => {
                updateLocalQuestions(
                  question.id.createdAt,
                  highlight,
                  !!question.hiddenBy
                );
                await updateWebinarQuestion({
                  id: question.id,
                  updates: {
                    highlightedBy: highlight
                      ? { operation: 'update', value: userName }
                      : { operation: 'remove' },
                  },
                });
              }}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WebinarQuestionsTable;
