import { CustomMessageTriggerEvent } from 'aws-lambda';

export const handler = async (event: CustomMessageTriggerEvent) => {
  const username = event.request.userAttributes['sub'];

  if (event.triggerSource === 'CustomMessage_SignUp') {
    const anchor = `<a href="https://domain/auth/confirmation?username=${username}&code=${event.request.codeParameter}">Verify</a>`;
    const emailMessage = `Your confirmation code is ${anchor}.`;
    const response = { ...event.response, emailMessage };
    return { ...event, response };
  } else {
    return event;
  }
};
