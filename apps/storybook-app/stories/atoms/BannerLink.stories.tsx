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
    icon: '{"data": {"id": 4,"attributes": {"name": "Business.svg","alternativeText": null,"caption": null,"width": 60,"height": 60,"formats": null,"hash": "Business_cada225ef4","ext": ".svg","mime": "image/svg+xml","size": 0.47,"url": "http://localhost:1337/uploads/Business_cada225ef4.svg","previewUrl": null,"provider": "strapi-provider-upload-custom","provider_metadata": null,"createdAt": "2024-06-12T10:56:56.199Z","updatedAt": "2024-06-12T10:56:56.199Z"}}}',
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