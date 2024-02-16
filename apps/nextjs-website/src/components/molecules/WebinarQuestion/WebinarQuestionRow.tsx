'use client';
import { WebinarQuestion } from '@/lib/webinars/webinarQuestions';
import { Box, IconButton, TableCell, TableRow, useTheme } from '@mui/material';
import { CopyToClipboardButton } from '@pagopa/mui-italia';
import DOMPurify from 'dompurify';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useFormatter, useTranslations } from 'next-intl';
import AutoFixOffIcon from '@mui/icons-material/AutoFixOff';

type WebinarQuestionRowProps = {
  question: WebinarQuestion;
  userEmail: string;
  onHighlight: (highlight: boolean) => Promise<void>;
  onHide: (hidden: boolean) => Promise<void>;
};

export default function WebinarQuestionRow({
  question,
  userEmail,
  onHide,
  onHighlight,
}: WebinarQuestionRowProps) {
  const formatter = useFormatter();
  const { palette } = useTheme();
  const t = useTranslations('webinar.questionList');

  const highlighted = question.highlightedBy;
  const hidden = question.hiddenBy;

  return (
    <TableRow
      hover
      key={question.createdAt.toJSON()}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
        '&.MuiTableRow-hover:hover': {
          backgroundColor: highlighted
            ? palette.primary.dark
            : palette.action.hover,
        },
        backgroundColor: highlighted ? palette.primary.light : '',
        fontStyle: hidden ? 'italic' : '',
      }}
    >
      <TableCell sx={{ color: highlighted ? palette.common.white : '' }}>
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
      <TableCell
        width='70%'
        sx={{ color: highlighted ? palette.common.white : '' }}
      >
        {!hidden
          ? question.question
          : hidden === userEmail
          ? t('hiddenByMe') + ' ( ' + question.question + ' )'
          : t('hiddenBy') + hidden}
      </TableCell>
      <TableCell>
        <Box display={'flex'} justifyContent={'space-between'}>
          {!hidden || (hidden && hidden == userEmail) ? (
            <IconButton
              onClick={() => onHide(!hidden)}
              sx={{ color: highlighted ? palette.common.white : '' }}
            >
              {!hidden ? <VisibilityOffIcon /> : <Visibility />}
            </IconButton>
          ) : (
            <></>
          )}

          {!hidden &&
            (userEmail === highlighted || !highlighted ? (
              <IconButton
                onClick={() => onHighlight(!highlighted)}
                sx={{ color: highlighted ? palette.common.white : '' }}
              >
                {!highlighted ? <AutoFixHighIcon /> : <AutoFixOffIcon />}
              </IconButton>
            ) : (
              <Box
                sx={{
                  position: 'absolute',
                  top: 4,
                  left: 16,
                  fontSize: 14,
                  color: palette.common.white,
                }}
              >
                {t('highlightedBy') + highlighted}
              </Box>
            ))}

          {!hidden && (
            <CopyToClipboardButton
              sx={{ color: highlighted ? palette.common.white : '' }}
              value={DOMPurify.sanitize(question.question)}
            ></CopyToClipboardButton>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
}
