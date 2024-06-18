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
                contentMaxWidth: 450,
                justify: 'right',
                theme: 'light',
                icon: 'Feedback',
                title: 'Titolo',
                content: [
                  {...mockTextBlock({type: 'paragraph', wordCount: 30})},
                ],
              },
              {
                contentMaxWidth: 450,
                justify: 'center',
                theme: 'dark',
                icon: 'Feedback',
                title: 'Titolo',
                content: [
                  {...mockTextBlock({type: 'paragraph', wordCount: 28})},
                ],
              },{
                contentMaxWidth: 450,
                justify: 'left',
                theme: 'light',
                icon: 'Feedback',
                title: 'Titolo',
                content: [
                  {...mockTextBlock({type: 'paragraph', wordCount: 32})},
                ],
              }
        ]
    }
}