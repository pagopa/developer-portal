import React, { ReactNode } from 'react';
import { parseInPageMenu } from 'gitbook-docs/parseInPageMenu';
import {
  RenderingComponents,
  renderInPageMenu,
} from 'gitbook-docs/renderInPageMenu';
import Heading from '@/components/organisms/GuideInPageMenu/components/Heading';
import { Typography, useTheme } from '@mui/material';

type GuideInPageMenuProps = {
  assetsPrefix: string;
  pagePath: string;
  inPageMenu: string;
  title: string;
};

const components: RenderingComponents<ReactNode> = {
  Heading: Heading,
};

const GuideInPageMenu = ({
  inPageMenu,
  assetsPrefix,
  pagePath,
  title,
}: GuideInPageMenuProps) => {
  const { palette } = useTheme();
  const nodes = parseInPageMenu(inPageMenu, { assetsPrefix, pagePath });

  return (
    nodes.length > 0 && (
      <>
        <Typography
          color={palette.text.secondary}
          fontSize={14}
          fontWeight={700}
          textTransform={'uppercase'}
          marginBottom={'18px'}
        >
          {title}
        </Typography>
        {renderInPageMenu(nodes, React, components)}
      </>
    )
  );
};

export default GuideInPageMenu;
