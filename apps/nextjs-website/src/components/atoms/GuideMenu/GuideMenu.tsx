/* eslint-disable */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { parseMenu } from "gitbook-docs/parseMenu";
import { RenderingComponents, renderMenu } from "gitbook-docs/renderMenu";
import React, { ReactNode, use, useEffect, useMemo } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/router";

type GuideMenuProps = {
  linkPrefix: string;
  assetsPrefix: string;
  menu: string;
};

const components: RenderingComponents<ReactNode> = {
  Link: ({ href, children }) => {
    const router = useRouter();
    const isSelected = useMemo(() => {
      const lastPathSegment = href?.split("/")[href?.split("/").length - 1];
      const routerLastPathSegment =
        router.asPath?.split("/")[router.asPath?.split("/").length - 1];

      return lastPathSegment === routerLastPathSegment;
    }, [children, href, router.asPath]);
    return (
      <ListItemButton
        component="a"
        href={href}
        style={{
          width: "100%",
          backgroundColor: isSelected ? "rgba(0, 115, 230, 0.08)" : undefined,
        }}
      >
        <Typography color={isSelected ? "#0062C3" : "black"}>
          {children}
        </Typography>
      </ListItemButton>
    );
  },
  Item: ({ isLeaf, children }) => {
    const router = useRouter();

    return (
      <ListItem
        className={isLeaf ? "leaf" : "node"}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          paddingLeft: "1rem",
        }}
      >
        {isLeaf ? (
          children
        ) : (
          <Accordion
            style={{
              background: "transparent",
              width: "100%",
              paddingRight: 0,
            }}
            defaultExpanded={children[0].props.href.includes(router.asPath)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {children[0]}
            </AccordionSummary>
            <AccordionDetails>{children.slice(1)}</AccordionDetails>
          </Accordion>
        )}
      </ListItem>
    );
  },
  List: ({ children }) => <List>{children}</List>,
  Title: ({ children }) => (
    <Typography
      component={"h2"}
      style={{
        color: "#5C6F82",
        textTransform: "uppercase",
        fontWeight: 700,
        fontSize: 14,
        marginLeft: "1rem",
      }}
    >
      {children}
    </Typography>
  ),
};

const GuideMenu = ({ menu, assetsPrefix, linkPrefix }: GuideMenuProps) =>
  renderMenu(parseMenu(menu, { assetsPrefix, linkPrefix }), React, components);

export default GuideMenu;
