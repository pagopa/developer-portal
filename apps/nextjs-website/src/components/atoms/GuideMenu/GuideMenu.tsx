import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';
import { parseMenu } from 'gitbook-docs/parseMenu';
import { RenderingComponents, renderMenu } from 'gitbook-docs/renderMenu';
import React, { ReactNode, use, useEffect, useMemo } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/router';
import { theme } from '@pagopa/mui-italia';

type GuideMenuProps = {
  linkPrefix: string;
  assetsPrefix: string;
  menu: string;
};

const components: RenderingComponents<ReactNode> = {
  Link: ({ href, children }) => {
    const router = useRouter();
    const isSelected = useMemo(() => {
      const lastPathSegment = href?.split('/')[href?.split('/').length - 1];
      const routerLastPathSegment =
        router.asPath?.split('/')[router.asPath?.split('/').length - 1];

      return lastPathSegment === routerLastPathSegment;
    }, [children, href, router.asPath]);
    return (
      <ListItemButton
        component='a'
        href={href}
        style={{
          width: '100%',
          backgroundColor: isSelected ? 'rgba(0, 115, 230, 0.08)' : undefined,
          position: 'relative',
        }}
      >
        {isSelected && (
          <div
            style={{
              position: 'absolute',
              left: -300,
              width: 300,
              height: '100%',
              backgroundColor: 'rgba(0, 115, 230, 0.08)',
            }}
          />
        )}

        <Typography color={isSelected ? theme.palette.primary.dark : 'black'}>
          {children}
        </Typography>

        {isSelected && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              width: 2,
              height: '100%',
              backgroundColor: 'rgba(0, 98, 195, 1)',
            }}
          />
        )}
      </ListItemButton>
    );
  },
  Item: ({ isLeaf, children }: any) => {
    const router = useRouter();

    return (
      <ListItem
        className={isLeaf ? 'leaf' : 'node'}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: 0,
          paddingLeft: '1rem',
        }}
      >
        {isLeaf ? (
          children
        ) : (
          <Accordion
            style={{
              background: 'transparent',
              width: '100%',
              paddingRight: 0,
            }}
            defaultExpanded={router.asPath.includes(children[0].props.href)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{ height: 60 }}
            >
              {children[0]}
            </AccordionSummary>
            <AccordionDetails style={{ padding: 0 }}>
              {children.slice(1)}
            </AccordionDetails>
          </Accordion>
        )}
      </ListItem>
    );
  },
  List: ({ children }: any) => <List>{children}</List>,
  Title: ({ children }: any) => (
    <Typography
      component={'h2'}
      style={{
        color: '#5C6F82',
        textTransform: 'uppercase',
        fontWeight: 700,
        fontSize: 14,
        marginLeft: '1rem',
      }}
    >
      {children}
    </Typography>
  ),
};

const GuideMenu = ({ menu, assetsPrefix, linkPrefix }: GuideMenuProps) =>
  renderMenu(parseMenu(menu, { assetsPrefix, linkPrefix }), React, components);

export default GuideMenu;
