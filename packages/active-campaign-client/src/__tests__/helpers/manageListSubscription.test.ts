// remove .skip to run the test, be aware it does real API calls
import {
  addContactToList,
  removeContactToList,
} from '../../helpers/manageListSubscription';

describe.skip('manage list subscription', () => {
  const cognitoUserId = process.env.TEST_COGNITO_USER_ID || '';
  const listName = process.env.TEST_LIST_NAME || '';

  it('should subscribe the contact to the list', async () => {
    const result = await addContactToList(cognitoUserId, listName);

    expect(result.statusCode).toBe(200);
  });

  it('should unsubscribe the contact from the list', async () => {
    const result = await removeContactToList(cognitoUserId, listName);
    expect(result.statusCode).toBe(200);
  });
});
