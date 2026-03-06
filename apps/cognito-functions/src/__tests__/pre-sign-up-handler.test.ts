import { PreSignUpTriggerEvent } from 'aws-lambda';
import { makeHandler } from '../pre-sign-up-handler';

const makeEvent = (
  attributes: Record<string, string>
): PreSignUpTriggerEvent => ({
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
      email: 'user@example.com',
      given_name: 'John',
      family_name: 'Doe',
      'custom:job_role': 'Developer',
      ...attributes,
    },
    validationData: {},
  },
  response: {
    autoConfirmUser: false,
    autoVerifyEmail: false,
    autoVerifyPhone: false,
  },
  triggerSource: 'PreSignUp_SignUp',
});

describe('PreSignUp Handler', () => {
  const allowedDomains = ['example.com'];
  const handler = makeHandler(allowedDomains);

  it('should return event for valid user', async () => {
    const event = makeEvent({});
    const result = await handler(event);
    expect(result).toBe(event);
  });

  it('should throw error for invalid email domain', async () => {
    const event = makeEvent({ email: 'user@other.com' });
    await expect(handler(event)).rejects.toThrow('Invalid email domain');
  });

  it('should throw error for invalid email format with valid domain', async () => {
    const event = makeEvent({ email: 'u ser@example.com' });
    await expect(handler(event)).rejects.toThrow('Invalid email format');
  });

  it('should throw error for invalid given name', async () => {
    const event = makeEvent({ given_name: 'Invalid@Name' });
    await expect(handler(event)).rejects.toThrow('Invalid given name');
  });

  it('should throw error for empty given name', async () => {
    const event = makeEvent({ given_name: '   ' });
    await expect(handler(event)).rejects.toThrow('Invalid given name');
  });

  it('should throw error for invalid family name', async () => {
    const event = makeEvent({ family_name: 'Invalid#Name' });
    await expect(handler(event)).rejects.toThrow('Invalid family name');
  });

  it('should throw error for invalid role', async () => {
    const event = makeEvent({ 'custom:job_role': 'Invalid/Role' });
    await expect(handler(event)).rejects.toThrow('Invalid role');
  });

  it('should allow valid role with spaces', async () => {
    const event = makeEvent({ 'custom:job_role': 'Software Engineer' });
    const result = await handler(event);
    expect(result).toBe(event);
  });
});
