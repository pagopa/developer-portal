import mixpanel from 'mixpanel-browser';

export const trackChatbotClick = () => {
  // eslint-disable-next-line functional/no-try-statements
  try {
    console.log(
      'Tracking chatbot click. Has opted out tracking? ',
      mixpanel.has_opted_out_tracking()
        ? 'Yes, stop tracking'
        : 'No, tracking event'
    );
    mixpanel.track('chatbot_opened');
    console.log('Chatbot click tracked');
  } catch {
    // Mixpanel is not initialized
    console.log('Unable to track chatbot click. Mixpanle not initialized');
  }
};
