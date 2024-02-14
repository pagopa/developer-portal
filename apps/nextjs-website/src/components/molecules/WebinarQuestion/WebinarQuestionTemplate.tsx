'use client';
import { WebinarQuestion } from '@/lib/webinars/webinarQuestions';
import { IconButton, TableCell, TableRow } from '@mui/material';
import { CopyToClipboardButton } from '@pagopa/mui-italia';
import DOMPurify from 'dompurify';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useFormatter, useTranslations } from 'next-intl';
import AutoFixOffIcon from '@mui/icons-material/AutoFixOff';

type WebinarQuestionTemplateProps = {
  question: WebinarQuestion;
  userEmail: string;
  onHighlight: () => Promise<void>;
  onHide: () => Promise<void>;
};

export default function WebinarQuestionsTemplate({
  question,
  userEmail,
  onHide,
  onHighlight,
}: WebinarQuestionTemplateProps) {
  const formatter = useFormatter();
  const t = useTranslations('webinar.questionList');

  const highlighted = question.highlightedBy;
  const hidden = question.hiddenBy;

  return (
    <TableRow
      hover
      key={question.createdAt.toJSON()}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
        backgroundColor: highlighted ? 'action.hover' : '',
        fontStyle: hidden ? 'italic' : '',
      }}
    >
      <TableCell>
        {!hidden
          ? formatter.dateTime(question.createdAt, {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })
          : ''}
      </TableCell>
      <TableCell width='70%'>
        {!hidden
          ? question.question
          : hidden === userEmail
          ? t('hiddenByMe') + ' ( ' + question.question + ' )'
          : t('hiddenBy') + hidden}
      </TableCell>
      <TableCell>
        {!hidden || (hidden && hidden == userEmail) ? (
          <IconButton onClick={onHide}>
            {!hidden ? <VisibilityOffIcon /> : <Visibility />}
          </IconButton>
        ) : (
          <></>
        )}
      </TableCell>
      <TableCell>
        {!hidden &&
          (userEmail === highlighted || !highlighted ? (
            <IconButton onClick={onHighlight}>
              {!highlighted ? <AutoFixHighIcon /> : <AutoFixOffIcon />}
            </IconButton>
          ) : (
            <>{t('highlightedBy') + highlighted}</>
          ))}
      </TableCell>
      <TableCell>
        {!hidden && (
          <CopyToClipboardButton
            value={DOMPurify.sanitize(question.question)}
          ></CopyToClipboardButton>
        )}
      </TableCell>
    </TableRow>
  );
}
