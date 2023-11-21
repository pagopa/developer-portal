import { PostConfirmationTriggerEvent } from 'aws-lambda';
import { makeHandler } from '../post-confirmation-handler';
import { SendEmailCommand, SES } from '@aws-sdk/client-ses';
import { mock, mockReset, captor } from 'jest-mock-extended';

const makeEvent = (): PostConfirmationTriggerEvent => ({
  version: 'aVersion',
  region: 'eu-south-1',
  userPoolId: 'aUserPoolId',
  userName: 'aUserName',
  callerContext: {
    awsSdkVersion: 'anAwsSdkVersion',
    clientId: 'aClientId',
  },
  request: {
    userAttributes: {
      sub: 'aSub',
      email_verified: 'true',
      'cognito:user_status': 'CONFIRMED',
      given_name: 'aGivenName',
      family_name: 'aFamilyName',
      email: 'a@email.com',
    },
  },
  response: {
    smsMessage: null,
    emailMessage: null,
    emailSubject: null,
  },
  triggerSource: 'PostConfirmation_ConfirmSignUp',
});

describe('Post confirmation handler', () => {
  const env = {
    config: {
      domain: 'thedomain.org',
      fromEmailAddress: 'from@email.com',
    },
    ses: mock<SES>(),
  };

  beforeEach(() => {
    mockReset(env.ses);
  });

  it('should send the email to the specified email address', async () => {
    const { ses: sesMock } = env;

    const sendEmailCommandCaptor = captor<SendEmailCommand>();

    const event = makeEvent();
    await makeHandler(env)(event);
    expect(sesMock.send).toHaveBeenCalled();
    expect(sesMock.send).toHaveBeenCalledWith(sendEmailCommandCaptor);

    expect(sendEmailCommandCaptor.value.input.Source).toStrictEqual(
      env.config.fromEmailAddress
    );
    expect(
      sendEmailCommandCaptor.value.input.Destination?.ToAddresses
    ).toContainEqual(event.request.userAttributes.email);
  });

  it('should not send the email because email address is missing', async () => {
    const { ses: sesMock } = env;
    const event = makeEvent();
    // Delete email from the event, so we can test that SES is not invoked.
    // Use delete because of StringMap type doesn't allow nullish values
    // eslint-disable-next-line functional/immutable-data
    delete event['request']['userAttributes']['email'];

    await makeHandler(env)(event);
    expect(sesMock.send).not.toHaveBeenCalled();
  });

  it('should not send the email on PostConfirmation_ConfirmForgotPassword event', async () => {
    const { ses: sesMock } = env;
    const event: PostConfirmationTriggerEvent = {
      ...makeEvent(),
      triggerSource: 'PostConfirmation_ConfirmForgotPassword',
    };

    await makeHandler(env)(event);
    expect(sesMock.send).not.toHaveBeenCalled();
  });
});
