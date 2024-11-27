// remove .skip to run the test, be aware it does real API calls
import { manageListSubscription } from '../../helpers/manageListSubscription';

describe.skip('manage list subscription', () => {
  const cognitoUserId = process.env.COGNITO_USER_ID || '';
  const listName = process.env.LIST_NAME || '';

  it('should subscribe the contact to the list', async () => {
    const result = await manageListSubscription(
      cognitoUserId,
      listName,
      'subscribe'
    );

    expect(result.statusCode).toBe(200);
  });

  it('should unsubscribe the contact from the list', async () => {
    const result = await manageListSubscription(
      cognitoUserId,
      listName,
      'unsubscribe'
    );
    expect(result.statusCode).toBe(200);
  });
});
