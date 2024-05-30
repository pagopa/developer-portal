import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import CtaCard from '../../../nextjs-website/src/components/atoms/CtaCard/CtaCard';
import IconWrapper from '../../../nextjs-website/src/components/atoms/IconWrapper/IconWrapper';

const meta: Meta<typeof CtaCard> = {
  title: 'Atoms/CtaCard',
  component: CtaCard,
};

export default meta;

export const ShowcaseWithIcon: StoryObj<typeof CtaCard> = {
  args: {
    title: 'Title',
    text: 'Text',
    cta: {
      label: 'Label',
      href: 'https://example.com',
    },
    icon:
      <IconWrapper
        icon='https://cdn.dev.developer.pagopa.it/app_Io_d9bffd556b.svg'
        isSvg={true}
      />,
    tags: [
      {
        label: 'Product',
        path: '/product',
      },
    ]
  },
};

