import { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import GitBookContent from 'nextjs-website/src/components/organisms/GitBookContent/GitBookContent';
import { Box } from '@mui/material';
import React from 'react';

const meta: Meta<typeof GitBookContent> = {
  title: 'Organisms/GitBookContent',
  component: GitBookContent,
};

const decorator: Decorator = (story) => (
  <Box sx={{ padding: { xs: 0, md: '2rem' } }}>{story()}</Box>
);

export default meta;

const mockMarkdown = `# Hello GitBook\n\nThis is a sample markdown for GitBookContent.\n\n- List item 1\n- List item 2\n\n[Link](https://example.com)`;

const mockConfig = {
  assetsPrefix: '',
  pagePath: '/docs/hello',
  isPageIndex: false,
  gitBookPagesWithTitle: [],
  spaceToPrefix: [],
  urlReplaces: {},
};

export const Showcase: StoryObj<typeof GitBookContent> = {
  args: {
    content: mockMarkdown,
    config: mockConfig,
  },
  decorators: [decorator],
};
