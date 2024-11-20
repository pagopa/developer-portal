import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { acClient } from '../activeCampaignClient';
import { Webinar } from 'nextjs-website/src/lib/types/webinar';
import { ListPayload } from '../types/listPayload';

export async function handler(event: {
  readonly Records: SQSEvent['Records'];
}): Promise<APIGatewayProxyResult> {
  try {
    const firstMessage = event.Records[0] ?? { body: '{}' };
    const webinarData: Webinar = JSON.parse(firstMessage.body);

    const acPayload: ListPayload = {
      list: {
        name: webinarData.slug,
        stringid: webinarData.title, // Using slug as the stringid
        sender_url: process.env.SENDER_URL || '',
        sender_reminder: webinarData.subscribeCtaLabel || '',
        subscription_notify: '',
        unsubscription_notify: '',
      },
    };

    const response = await acClient.createList(acPayload);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
