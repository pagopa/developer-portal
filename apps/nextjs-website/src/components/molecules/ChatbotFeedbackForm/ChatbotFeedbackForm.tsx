import {
  Box,
  Button,
  InputBase,
  Rating,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { History } from '@mui/icons-material';
import React, { ChangeEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { styled } from '@mui/material/styles';

const MESSAGE_MAX_CHARS = 330;

type ChatbotFeedbackProps = {
  disabled: boolean;
  answerId: string;
  onClose: () => Promise<void>;
  onSend: (
    answerId: string,
    contextScore: number,
    responseScore: number,
    comment: string
  ) => Promise<void>;
};

const ChatbotFeedbackForm = ({
  disabled,
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
      {!disabled && (
        <Box
          sx={{
            backgroundColor: palette.background.paper,
            borderBottom: '2px solid',
            borderBottomColor: palette.action.disabled,
            width: 'auto',
          }}
        >
          <Stack direction={'row'} paddingY={'0.25rem'}>
            <Button
              href='/profile/chatbot-history'
              size='small'
              sx={{ margin: '0.4rem', paddingX: '0.4rem' }}
            >
              <History fontSize='small' />
              <span style={{ fontSize: '1rem', marginLeft: '0.5rem' }}>
                {t('chatBot.history')}
              </span>
            </Button>
          </Stack>
        </Box>
      )}
      <Stack
        maxWidth='472px'
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
        <InputBase
          inputRef={(input) => input && input.focus()}
          fullWidth
          placeholder={t('chatBot.feedback.inputPlaceholder')}
          value={comment}
          onChange={handleChange}
          multiline
          sx={{
            alignItems: 'flex-start',
            borderWidth: '2px',
            paddingX: { xs: 1.5, md: 2 },
            paddingY: 1,
            borderRadius: 2,
            borderStyle: 'solid',
            borderColor: comment.length
              ? palette.primary.main
              : palette.action.disabled,
            fontSize: '0.875rem',
            height: '130px',
            maxWidth: '504px',
          }}
        />
        <Typography
          sx={{
            paddingLeft: '14px',
            fontWeight: '600',
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0px',
            verticalAlign: 'middle',
            color: palette.action.disabled,
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
