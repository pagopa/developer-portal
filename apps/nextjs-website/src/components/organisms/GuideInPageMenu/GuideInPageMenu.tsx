'use client';
import React, { ReactNode, useEffect, useRef } from 'react';
import { parseInPageMenu } from 'gitbook-docs/parseInPageMenu';
import {
  RenderingComponents,
  renderInPageMenu,
} from 'gitbook-docs/renderInPageMenu';
import Heading from '@/components/organisms/GuideInPageMenu/components/Heading';
import { Box, Typography, useTheme } from '@mui/material';
import { useFragment } from '@/components/organisms/FragmentProvider/FragmentProvider';
import { SITE_HEADER_HEIGHT } from '../../molecules/SiteHeader/SiteHeader';
import { PRODUCT_HEADER_HEIGHT } from '../../atoms/ProductHeader/ProductHeader';

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
  const { fragment, setFragmentFromScroll } = useFragment();
  const fragmentRef = useRef(fragment);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const nodes = parseInPageMenu(inPageMenu, { assetsPrefix, pagePath });
  const headerOffset = PRODUCT_HEADER_HEIGHT + SITE_HEADER_HEIGHT;

  useEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    fragmentRef.current = fragment;
  }, [fragment]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const menuContainer = menuContainerRef.current;
    if (!menuContainer) return;

    const anchors = Array.from(
      menuContainer.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    );

    const headingElements = anchors
      .map((anchor) => {
        const hash = anchor.getAttribute('href');
        if (!hash) return null;
        return document.getElementById(hash.slice(1));
      })
      .filter((element): element is HTMLElement => element !== null);

    if (headingElements.length === 0) return;

    const TOP_OFFSET = SITE_HEADER_HEIGHT + PRODUCT_HEADER_HEIGHT;
    // eslint-disable-next-line functional/no-let
    let ticking = false;

    const updateCurrentHeading = () => {
      // eslint-disable-next-line functional/no-let
      let activeId: string | null = null;

      // eslint-disable-next-line functional/no-loop-statements
      for (const headingElement of headingElements) {
        const { top } = headingElement.getBoundingClientRect();

        if (top <= TOP_OFFSET) {
          activeId = headingElement.id;
          continue;
        }

        if (!activeId) {
          activeId = headingElement.id;
        }

        break;
      }

      if (!activeId) {
        activeId = headingElements[headingElements.length - 1].id;
      }

      const nextFragment = `#${activeId}`;

      if (fragmentRef.current === nextFragment) return;

      const updated = setFragmentFromScroll(nextFragment);
      if (updated) {
        // eslint-disable-next-line functional/immutable-data
        fragmentRef.current = nextFragment;
      }
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        ticking = false;
        updateCurrentHeading();
      });
    };

    updateCurrentHeading();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [inPageMenu, setFragmentFromScroll]);

  return (
    nodes.length > 0 && (
      <Box
        ref={menuContainerRef}
        sx={{
          maxHeight: `calc(100vh - ${headerOffset}px)`,
          overflowY: 'auto',
          paddingTop: '50px',
        }}
      >
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
      </Box>
    )
  );
};

export default GuideInPageMenu;
