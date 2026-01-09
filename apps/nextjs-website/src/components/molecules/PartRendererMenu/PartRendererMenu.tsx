'use client';
import { Part } from '@/lib/types/part';
import React, { ReactNode, isValidElement } from 'react';

import { Box, Typography, useTheme } from '@mui/material';

import BlocksRendererClientMenu from '../BlocksRendererClientMenu/BlocksRendererClientMenu';
import { generateIdFromString } from '@/helpers/anchor.helpers';
import { useTranslations } from 'next-intl';
import Heading from '@/components/organisms/GuideInPageMenu/components/Heading';
import { includes, some } from 'lodash';
import { headingLevelsToShowInMenu } from '@/config';

type PartRendererMenuProps = {
  readonly parts: readonly Part[];
};

const PartRendererMenu = (props: PartRendererMenuProps): ReactNode | null => {
  const { palette } = useTheme();
  const t = useTranslations();
  const menuItems = props.parts
    .map((part) => {
      switch (part.component) {
        case 'blockRenderer':
          // eslint-disable-next-line no-case-declarations
          const hasHeading = some(
            part.html,
            (block) => block.type === 'heading'
          );

          return hasHeading ? (
            <BlocksRendererClientMenu content={part.html} />
          ) : null;
        case 'markdown': {
          const headingRegex = /^(#{2,})\s+(.+)/gm;
          const stepTag = /\{% step %}/g;
          const stepIndices = Array.from(
            part.content.matchAll(stepTag),
            (match) => match.index || 0
          );

          const matches = [...part.content.matchAll(headingRegex)];
          const createSlug = (text: string) =>
            text
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-');

          return matches.map((match) => {
            const level = match[1].length;
            if (!includes(headingLevelsToShowInMenu, level)) return null;

            const title = match[2]
              .trim()
              .replace(/&[a-zA-Z0-9#]+;/g, ' ')
              .replace(/\s+/g, ' ');
            const href = `${createSlug(title)}`;
            const lastStepIndex =
              level === 3 && stepIndices.length > 0
                ? stepIndices.findLast((index) => index < (match?.index || 0))
                : undefined;
            const stepNumber = lastStepIndex
              ? stepIndices.indexOf(lastStepIndex) + 1
              : undefined;
            const finalTitle = stepNumber ? stepNumber + ' - ' + title : title;
            return (
              <Heading key={finalTitle} level={level} id={href}>
                {stepNumber ? (
                  <>
                    <span
                      style={{
                        color: palette.primary.main,
                      }}
                    >
                      {stepNumber}
                    </span>
                    {' - ' + title}
                  </>
                ) : (
                  title
                )}
              </Heading>
            );
          });
        }
        case 'ckEditor':
          return part.menuItems
            .filter((menuItem) =>
              includes(headingLevelsToShowInMenu, menuItem.level)
            )
            .map((menuItem) => (
              <Heading
                key={menuItem.title}
                level={menuItem.level}
                id={menuItem.href}
              >
                {menuItem.title}
              </Heading>
            ));
        case 'typography':
          if (
            !includes(
              headingLevelsToShowInMenu.map((level) => `h${level}`),
              part?.variant
            )
          )
            return null;

          return (
            <Heading
              level={part.variant === 'h2' ? 2 : 3}
              id={computeId('typography', part.text)}
            >
              {part.text}
            </Heading>
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
        marginLeft='8px'
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
    if (
      isValidElement(children) &&
      'text' in (children.props as Record<string, unknown>)
    ) {
      const text = generateIdFromString(
        (children.props as { text: string }).text
      );
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
