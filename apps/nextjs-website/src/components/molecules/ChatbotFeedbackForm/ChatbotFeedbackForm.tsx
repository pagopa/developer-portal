import {
  Box,
  Button,
  Rating,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';

const MESSAGE_MAX_CHARS = 500;

type ChatbotFeedbackProps = {
  answerId: string;
  onClose: () => null;
  onSend: (
    answerId: string,
    contextScore: number,
    responseScore: number,
    comment: string
  ) => null;
};

const ChatbotFeedbackForm = ({
  answerId = '',
  onClose,
  onSend,
}: ChatbotFeedbackProps) => {
  const t = useTranslations();
  const { palette } = useTheme();
  const [contextRelevancy, setContextRelevancy] = useState(0);
  const [responseRelevancy, setResponseRelevancy] = useState(0);
  const [comment, setComment] = useState('');
  const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
      color: palette.primary.main,
    },
    '& .MuiRating-iconHover': {
      color: palette.primary.main,
    },
    '& .MuiRating-iconEmpty': {
      color: palette.grey[500],
    },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(
      event.target.value
        .slice(0, MESSAGE_MAX_CHARS)
        .replace(/(\r\n|\n|\r)/gm, '')
    );
  };

  return (
    <>
      <Stack
        direction={'column'}
        sx={{
          overflow: 'auto',
          paddingRight: '0.5rem',
          paddingX: { xs: 1, md: 4 },
          backgroundColor: palette.background.paper,
          height: '100%',
        }}
      >
        <Typography
          fontWeight={600}
          fontSize={16}
          letterSpacing={0}
          sx={{ paddingTop: '28px', paddingBottom: '8px' }}
        >
          {t('chatBot.feedback.contextRelevancy')}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <StyledRating
            value={contextRelevancy}
            onChange={(event, newValue) => {
              setContextRelevancy(newValue || 0);
            }}
            emptyIcon={
              <StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />
            }
            size='large'
          />
        </Box>
        <Typography
          fontWeight={600}
          fontSize={16}
          letterSpacing={0}
          sx={{ paddingTop: '24px', paddingBottom: '8px' }}
        >
          {t('chatBot.feedback.responseRelevancy')}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <StyledRating
            value={responseRelevancy}
            onChange={(event, newValue) => {
              setResponseRelevancy(newValue || 0);
            }}
            emptyIcon={
              <StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />
            }
            size='large'
          />
        </Box>
        <Typography
          fontWeight={600}
          fontSize={16}
          letterSpacing={0}
          sx={{ paddingTop: '24px', paddingBottom: '16px' }}
        >
          {t('chatBot.feedback.comment')}
        </Typography>
        <TextField
          id={'outlined-suffix-shrink'}
          variant={'outlined'}
          inputRef={(input) => input && input.focus()}
          fullWidth
          value={comment}
          label={t('chatBot.feedback.inputPlaceholder')}
          onChange={handleChange}
          multiline
          rows={5}
          sx={{
            '& fieldset > legend > span': { fontSize: '11px' },
            '& .MuiInputBase-input': {
              color: palette.text.primary,
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '21px',
              letterSpacing: '0px',
            },
            '& .MuiFormLabel-root': {
              fontSize: '14px',
              fontWeight: 600,
              color: '#A2ADB8',
              paddingLeft: '4px',
            },
          }}
        />
        <Typography
          sx={{
            paddingLeft: '14px',
            fontWeight: 600,
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0px',
            verticalAlign: 'middle',
            color: palette.text.secondary,
          }}
        >
          {t('chatBot.feedback.mandatoryFields')}
        </Typography>
        <Stack
          direction='row'
          spacing='10px'
          sx={{
            paddingTop: '24px',
            paddingBottom: '20px',
            display: 'flex',
            justifyContent: 'end',
            alignContent: 'flex-end',
          }}
        >
          <Button variant={'text'} onClick={onClose}>
            {t(`chatBot.feedback.undo`)}
          </Button>
          <Button
            disabled={!comment.length}
            variant={'contained'}
            onClick={() => {
              return onSend(
                answerId,
                contextRelevancy,
                responseRelevancy,
                comment
              );
            }}
          >
            {t(`chatBot.feedback.send`)}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default ChatbotFeedbackForm;
