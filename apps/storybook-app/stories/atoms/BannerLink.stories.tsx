import { Meta, StoryObj } from '@storybook/react';
import { BannerLink } from '../../../nextjs-website/src/components/atoms/BannerLink/BannerLink';
import { mockTextBlock, mockText } from '../mock-content.helper';

const meta: Meta<typeof BannerLink> = {
  title: 'Atoms/BannerLink',
  component: BannerLink,
};

export default meta;

export const Showcase: StoryObj<typeof BannerLink> = {
  args: {
    theme: 'light',
    icon: 'Feedback',
    title: 'Titolo',
    content: [
      {...mockTextBlock({type: 'paragraph', wordCount: 10})},
      {
        'type': 'list',
        'format': 'unordered',
        'children': [
          {
            'type': 'list-item',
            'children': [
              {
                'type': 'text',
                'text': 'Le comunicazioni in tempo reale',
                'bold': true
              },
              {
                'type': 'text',
                'text': ' consentono al cittadino di agire con tempestività sul pagamento di sanzioni'
              }
            ]
          },
          {
            'type': 'list-item',
            'children': [
              {
                'type': 'text',
                'text': 'La scadenza sugli avvisi di pagamento',
                'bold': true
              },
              {
                'type': 'text',
                'text': ' riduce la possibilità di incorrere in sanzioni aggiuntive'
              }
            ]
          }
        ]
      },
    ],
  }
};