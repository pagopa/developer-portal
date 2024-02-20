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
  userName: string;
  onHighlight: (highlight: boolean) => Promise<void>;
  onHide: (hidden: boolean) => Promise<void>;
};

export default function WebinarQuestionRow({
  question,
  userName,
  onHide,
  onHighlight,
}: WebinarQuestionRowProps) {
  const formatter = useFormatter();
  const { palette } = useTheme();
  const t = useTranslations('webinar.questionList');

  const { hiddenBy, highlightedBy } = question;

  const isHidden = !!hiddenBy;
  const isHighlighted = !!highlightedBy;

  return (
    <TableRow
      hover
      key={question.createdAt.toJSON()}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
        '&.MuiTableRow-hover:hover': {
          backgroundColor: isHighlighted
            ? palette.primary.dark
            : palette.action.hover,
        },
        backgroundColor: isHighlighted ? palette.primary.light : '',
        fontStyle: isHidden ? 'italic' : '',
        position: 'relative',
      }}
    >
      <TableCell sx={{ color: isHighlighted ? palette.common.white : '' }}>
        {!isHidden
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
        sx={{ color: isHighlighted ? palette.common.white : '' }}
      >
        {!isHidden
          ? question.question
          : isHidden && hiddenBy === userName
          ? `${t('hiddenByMe')}: (${question.question})`
          : `${t('hiddenBy')}: ${hiddenBy}`}
      </TableCell>
      <TableCell>
        <Box display={'flex'} justifyContent={'space-between'}>
          {!isHidden || (isHidden && hiddenBy === userName) ? (
            <IconButton
              onClick={() => onHide(!isHidden)}
              sx={{ color: isHighlighted ? palette.common.white : '' }}
            >
              {!isHidden ? <VisibilityOffIcon /> : <Visibility />}
            </IconButton>
          ) : (
            <></>
          )}

          {!isHidden &&
            (userName === highlightedBy || !isHighlighted ? (
              <IconButton
                onClick={() => onHighlight(!isHighlighted)}
                sx={{ color: isHighlighted ? palette.common.white : '' }}
              >
                {!isHidden ? <AutoFixHighIcon /> : <AutoFixOffIcon />}
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
                {t('highlightedBy')}: {highlightedBy}
              </Box>
            ))}

          {!isHidden && (
            <CopyToClipboardButton
              sx={{ color: isHighlighted ? palette.common.white : '' }}
              value={DOMPurify.sanitize(question.question)}
            ></CopyToClipboardButton>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
}
