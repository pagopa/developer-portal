import { Meta, StoryObj } from "@storybook/react";
import { BannerLinks } from '../../../nextjs-website/src/components/molecules/BannerLinks/BannerLinks';
import { mockTextBlock } from "../mock-content.helper";

const meta: Meta<typeof BannerLinks> = {
    title: 'Molecules/BannerLinks',
    component: BannerLinks,
  };
  
export default meta;

export const Showcase: StoryObj<typeof BannerLinks> = {
    args:{
        banners:[
            {
                maxWidth: 448,
                justify: 'center',
                theme: 'light',
                icon: 'Feedback',
                title: 'Titolo',
                content: [
                  {...mockTextBlock({type: 'paragraph', wordCount: 6})},
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
              },
              {
                maxWidth: 448,
                justify: 'center',
                theme: 'dark',
                icon: 'Feedback',
                title: 'Titolo',
                content: [
                  {...mockTextBlock({type: 'paragraph', wordCount: 6})},
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
              },{
                maxWidth: 448,
                justify: 'center',
                theme: 'light',
                icon: 'Feedback',
                title: 'Titolo',
                content: [
                  {...mockTextBlock({type: 'paragraph', wordCount: 6})},
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
        ]
    }
}