import { WebinarQuestion } from '@/lib/webinars/webinarQuestions';
import {
  Box,
  IconButton,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { CopyToClipboardButton } from '@pagopa/mui-italia';
import DOMPurify from 'dompurify';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useTranslations } from 'next-intl';
import AutoFixOffIcon from '@mui/icons-material/AutoFixOff';
import { defaultLocale, timeOptions } from '@/config';

type WebinarQuestionRowProps = {
  question: WebinarQuestion;
  userName: string;
  onHighlight: (highlighted: boolean) => Promise<void>;
  onHide: (hidden: boolean) => Promise<void>;
};

export default function WebinarQuestionRow({
  question,
  userName,
  onHide,
  onHighlight,
}: WebinarQuestionRowProps) {
  const { palette } = useTheme();
  const t = useTranslations('webinar.questionList');

  const { hiddenBy, highlightedBy } = question;

  const isHidden = !!hiddenBy;
  const isHiddenByMe = hiddenBy === userName;
  const isHighlighted = !!highlightedBy;

  const tcColor =
    isHighlighted && !isHidden ? palette.common.white : palette.text.primary;

  return (
    (!isHidden || isHiddenByMe) && (
      <TableRow
        hover
        key={question.id.createdAt.toISOString()}
        sx={{
          '&:last-child td, &:last-child th': { border: 0 },
          '&.MuiTableRow-hover:hover': {
            backgroundColor:
              isHighlighted && !isHidden
                ? palette.primary.dark
                : palette.action.hover,
          },
          '& > .MuiTableCell-root': {
            padding: '32px 16px 24px 16px',
          },
          backgroundColor:
            isHighlighted && !isHidden ? palette.primary.light : '',
          fontStyle: isHidden ? 'italic' : '',
          position: 'relative',
        }}
      >
        <TableCell
          width='100%'
          sx={{
            color: tcColor,
            '& > .MuiTypography-root': {
              color: tcColor,
            },
          }}
        >
          {isHighlighted && !isHidden && (
            <Box
              sx={{
                fontSize: 14,
                color: palette.common.white,
                marginBottom: 2,
              }}
            >
              {t('highlightedBy')}: {highlightedBy}
            </Box>
          )}
          <Typography fontStyle={'italic'} fontSize={14}>
            {!isHidden
              ? question.id.createdAt.toLocaleTimeString(
                  defaultLocale,
                  timeOptions
                )
              : ''}
          </Typography>
          <Typography>
            {isHiddenByMe
              ? `${t('hiddenByMe')}: (${question.question})`
              : question.question}
          </Typography>
          <Box display={'flex'} justifyContent={'end'} mt={2}>
            {(!isHidden || (isHidden && isHiddenByMe)) && (
              <IconButton
                onClick={() => onHide(!isHidden)}
                sx={{ color: tcColor }}
              >
                {!isHidden ? <VisibilityOffIcon /> : <Visibility />}
              </IconButton>
            )}

            {!isHidden && (userName === highlightedBy || !isHighlighted) && (
              <IconButton
                onClick={() => onHighlight(!isHighlighted)}
                sx={{ color: tcColor }}
              >
                {!isHighlighted ? <AutoFixHighIcon /> : <AutoFixOffIcon />}
              </IconButton>
            )}
            {!isHidden && (
              <CopyToClipboardButton
                sx={{ color: tcColor }}
                value={DOMPurify.sanitize(question.question)}
              ></CopyToClipboardButton>
            )}
          </Box>
        </TableCell>
      </TableRow>
    )
  );
}
