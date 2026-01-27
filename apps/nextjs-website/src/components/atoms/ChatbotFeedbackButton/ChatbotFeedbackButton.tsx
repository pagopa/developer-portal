import { Check, ThumbDownAlt, ThumbDownAltOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const TOOLTIP_DURATION = 2000;

type ChatbotFeedbackButtonProps = {
  mustFillFeedbackForm: boolean;
  isNegativeFeedbackGiven: boolean;
  onToggleNegativeFeedback: (negativeFeedback: boolean) => null;
};

const ChatbotFeedbackButton = ({
  mustFillFeedbackForm,
  isNegativeFeedbackGiven,
  onToggleNegativeFeedback,
}: ChatbotFeedbackButtonProps) => {
  const t = useTranslations();
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const onToggle = (negativeFeedback: boolean) => {
    if (!mustFillFeedbackForm || negativeFeedback) {
      onToggleNegativeFeedback(negativeFeedback);
      setFeedbackGiven(true);
      setTimeout(() => setFeedbackGiven(false), TOOLTIP_DURATION);
    }
  };

  return (
    <>
      <IconButton
        onClick={() => onToggle(!isNegativeFeedbackGiven)}
        disabled={feedbackGiven}
        sx={{
          cursor: 'pointer',
        }}
      >
        {feedbackGiven ? (
          <Tooltip
            PopperProps={{
              disablePortal: true,
              sx: {
                display: 'block',
                whiteSpace: 'nowrap',
              },
            }}
            open={true}
            placement='bottom'
            title={t('chatBot.feedbackGiven')}
            arrow
          >
            <Check color='success' fontSize='small' />
          </Tooltip>
        ) : isNegativeFeedbackGiven ? (
          <ThumbDownAlt fontSize='small' />
        ) : (
          <ThumbDownAltOutlined fontSize='small' />
        )}
      </IconButton>
    </>
  );
};

export default ChatbotFeedbackButton;
