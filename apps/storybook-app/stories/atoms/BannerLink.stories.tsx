import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
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
    icon: {
      "data": {
"id": 3,
"attributes": {
"name": "HeadsetMic.svg",
"alternativeText": null,
"caption": null,
"width": 46,
"height": 56,
"formats": null,
"hash": "Headset_Mic_b52813c3e1",
"ext": ".svg",
"mime": "image/svg+xml",
"size": 0.36,
"url": "http://localhost:1337/uploads/Headset_Mic_b52813c3e1.svg",
"previewUrl": null,
"provider": "strapi-provider-upload-custom",
"provider_metadata": null,
"createdAt": "2024-06-11T16:34:18.514Z",
"updatedAt": "2024-06-11T16:34:18.514Z"
}
}},
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