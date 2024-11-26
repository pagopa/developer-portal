import { manageListSubscription } from '../../handlers/manageListSubscription';

// remove .skip to run the test, be aware it does real API calls
describe('manage list subscription', () => {
  const cognitoUserId = '66ae52a0-f051-7080-04a1-465b3a4f44cc';
  const listName = 'test-webinar-1732097286071';

  it('should subscriber the contact to the list', async () => {
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
