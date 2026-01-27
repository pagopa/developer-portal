import {
  Box,
  Button,
  Rating,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';

const MESSAGE_MAX_CHARS = 800;

type ChatbotFeedbackProps = {
  sessionId: string;
  id: string;
  onClose: () => null;
  onSend: (
    hasNegativeFeedback: boolean,
    sessionId: string,
    chatId: string,
    contextScore: number | null,
    responseScore: number | null,
    comment: string
  ) => null;
  setIsFormVisible: (boolean: boolean) => null;
};

const ChatbotFeedbackForm = ({
  sessionId,
  id,
  onClose,
  onSend,
  setIsFormVisible,
}: ChatbotFeedbackProps) => {
  const t = useTranslations();
  const { palette } = useTheme();
  const [userResponseRelevancy, setUserResponseRelevancy] = useState(0);
  const [userFaithfullness, setUserFaithfullness] = useState(0);
  const [userComment, setUserComment] = useState('');
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
    setUserComment(
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
          sx={{ paddingTop: '20px', paddingBottom: '8px' }}
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
            value={userResponseRelevancy}
            onChange={(event: SyntheticEvent, newValue: number | null) => {
              setUserResponseRelevancy(newValue || 0);
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
          sx={{ paddingTop: '20px', paddingBottom: '8px' }}
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
            value={userFaithfullness}
            onChange={(event: SyntheticEvent, newValue: number | null) => {
              setUserFaithfullness(newValue || 0);
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
          sx={{ paddingTop: '20px', paddingBottom: '16px' }}
        >
          {t('chatBot.feedback.comment')}
        </Typography>
        <TextField
          fullWidth
          value={userComment}
          label={t('chatBot.feedback.inputPlaceholder')}
          InputLabelProps={{
            style: {
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '21px',
              letterSpacing: '0px',
            },
          }}
          onChange={handleChange}
          multiline
          rows={4}
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
            paddingTop: '20px',
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
            disabled={!userComment.length}
            variant={'contained'}
            onClick={() => {
              setIsFormVisible(false);
              return onSend(
                true,
                sessionId,
                id,
                userResponseRelevancy ? userResponseRelevancy / 5 : null,
                userFaithfullness ? userFaithfullness / 5 : null,
                userComment
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
