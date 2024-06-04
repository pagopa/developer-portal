import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import IconWrapper from '../../../nextjs-website/src/components/atoms/IconWrapper/IconWrapper';
import TabComponent from '../../../nextjs-website/src/components/atoms/TabComponent/TabComponent';

const meta: Meta<typeof TabComponent> = {
  title: 'Atoms/TabComponent',
  component: TabComponent,
};

export default meta;

export const TabsComponent: StoryObj<typeof TabComponent> = {
  args: {
    items: [
        {
            title: 'Title',
            content: <IconWrapper
            icon='https://cdn.dev.developer.pagopa.it/app_Io_d9bffd556b.svg'
            isSvg={true}
          />
        },
        {
            title: 'Title of the second page',
            content: <div>
                <h1>Second Page</h1>
                <p>Some content here</p>
            </div>
        }
    ]
  },
};

