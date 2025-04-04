'use client';
import { Part } from '@/lib/types/part';
import React, { ReactNode } from 'react';

import { Box, Typography, useTheme } from '@mui/material';

import BlocksRendererClientMenu from '../BlocksRendererClientMenu/BlocksRendererClientMenu';
import { generateIdFromString } from '@/helpers/anchor.helpers';
import MUILink from '@mui/material/Link';
import { useTranslations } from 'next-intl';

type PartRendererMenuProps = {
  readonly parts: readonly Part[];
};

const getFontSizeByLevel = (level: number): number => {
  switch (level) {
    case 1:
      return 24;
    case 2:
      return 18;
    case 3:
      return 16;
    case 4:
    default:
      return 14;
  }
};

const PartRendererMenu = (props: PartRendererMenuProps): ReactNode | null => {
  const { palette } = useTheme();
  const t = useTranslations();
  const menuItems = props.parts
    .map((part) => {
      switch (part.component) {
        case 'blockRenderer':
          // eslint-disable-next-line no-case-declarations
          const hasHeading = part.html.reduce((acc, block) => {
            if (block.type === 'heading') {
              return true;
            }
            return acc;
          }, false);
          return hasHeading ? (
            <BlocksRendererClientMenu content={part.html} />
          ) : null;
        case 'codeBlock':
          return (
            <a
              key={part.title}
              href={`#${computeId('codeBlock', part.title)}`}
              style={{ textDecoration: 'none' }}
            >
              <Typography>{part.title}</Typography>
            </a>
          );
        case 'ckEditor':
          return part.menuItems.map((menuItem) => (
            <MUILink
              key={menuItem.title}
              href={menuItem.href}
              title={menuItem.title}
              sx={{
                display: 'block',
                fontFamily: 'Titillium Web',
                marginBottom: '12px',
                textDecoration: 'none',
              }}
            >
              <Typography
                sx={{
                  color: palette.text.secondary,
                  fontSize: getFontSizeByLevel(menuItem.level),
                  fontWeight: 400,
                }}
              >
                {menuItem.title}
              </Typography>
            </MUILink>
          ));
        case 'typography':
          if (!['h1', 'h2', 'h3', 'h4'].includes(part?.variant ?? ''))
            return null;

          return (
            <a
              key={part.text}
              href={`#${computeId('typography', part.text)}`}
              style={{ textDecoration: 'none' }}
            >
              <Typography>{part.text}</Typography>
            </a>
          );
        default:
          return null;
      }
    })
    .filter(Boolean);

  if (menuItems.flat().length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        '& > br': {
          display: 'none',
        },
      }}
    >
      <Typography
        color={palette.text.secondary}
        fontSize={14}
        fontWeight={700}
        textTransform={'uppercase'}
        marginBottom={'18px'}
      >
        {t('productGuidePage.onThisPage')}
      </Typography>
      {menuItems}
    </Box>
  );
};

export function computeId(type: string, children: ReactNode | string): string {
  if (typeof children === 'string') {
    return `${type}-${generateIdFromString(children)}`;
  }

  if (!Array.isArray(children)) {
    // if children is react element and has props text return that
    if (children && typeof children === 'object' && 'props' in children) {
      const text = generateIdFromString(children.props.text);
      return `${type}-${text}`;
    }

    return generateIdFromString(children?.toString()) ?? '';
  }

  return children
    .map((child: ReactNode) => {
      return computeId(type, child);
    })
    .join('-');
}

export default PartRendererMenu;
