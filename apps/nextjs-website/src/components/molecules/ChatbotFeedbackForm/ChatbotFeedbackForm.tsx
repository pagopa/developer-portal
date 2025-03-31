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
import StarIcon from '@mui/icons-material/Star';

const MESSAGE_MAX_CHARS = 560;

type ChatbotFeedbackProps = {
  disabled: boolean;
  answerId: string;
  onClose: () => null;
  contextRelevancy: number;
  // eslint-disable-next-line functional/no-return-void
  setContextRelevancy: (value: number) => void;
  responseRelevancy: number;
  // eslint-disable-next-line functional/no-return-void
  setResponseRelevancy: (value: number) => void;
  comment: string;
  // eslint-disable-next-line functional/no-return-void
  setComment: (value: string) => void;
  onSend: (
    answerId: string,
    contextScore: number,
    responseScore: number,
    comment: string
  ) => null;
};

const ChatbotFeedbackForm = ({
  disabled,
  answerId = '',
  onClose,
  contextRelevancy,
  setContextRelevancy,
  responseRelevancy,
  setResponseRelevancy,
  comment,
  setComment,
  onSend,
}: ChatbotFeedbackProps) => {
  const t = useTranslations();
  const { palette } = useTheme();
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
            defaultValue={contextRelevancy}
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
            defaultValue={responseRelevancy}
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
            height: '160px',
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
