import mixpanel from 'mixpanel-browser';

export const trackChatbotClick = () => {
  // eslint-disable-next-line functional/no-try-statements
  try {
    mixpanel.track('chatbot_opened');
  } catch {
    // Mixpanel is not initialized
  }
};
