import mixpanel from 'mixpanel-browser';

export const trackChatbotClick = () => {
  // eslint-disable-next-line functional/no-try-statements
  try {
    if (!mixpanel.has_opted_out_tracking()) {
      mixpanel.track('chatbot_opened');
    }
  } catch {
    // Mixpanel is not initialized
  }
};
