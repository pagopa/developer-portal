"use client";
import {
  SITE_HEADER_HEIGHT,
  SiteHeaderProps,
} from "@/components/molecules/SiteHeader/SiteHeader";
import Button from "@mui/material/Button";
import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Box, Divider, useTheme } from "@mui/material";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import MobileUserInfo from "@/components/atoms/MobileUserInfo/MobileUserInfo";

export const MobileSiteHeaderStyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`&`]: {
    "--x": 16,
    marginBottom: 16,
  },
  [`& .${treeItemClasses.content}`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
    color: theme.palette.primary.dark,
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "start",
    gap: 0,
    padding: 0,
    margin: 0,
  },
  [`& .${treeItemClasses.content} .${treeItemClasses.focused}`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  [`& .${treeItemClasses.content}:hover`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  [`& .${treeItemClasses.content}:has(.${treeItemClasses.iconContainer}:empty)`]:
    {
      paddingRight: 0,
    },
  [`& .${treeItemClasses.iconContainer}`]: {
    marginTop: 0,
    marginLeft: 8,
    marginRight: 0,
    marginBottom: 16,
    paddingRight: 0,
    paddingLeft: 0,
  },
  [`& .${treeItemClasses.iconContainer}:empty`]: {
    display: "none",
  },
  [`& .${treeItemClasses.content} > .${treeItemClasses.label}`]: {
    color: theme.palette.primary.dark,
    fontSize: 18,
    fontWeight: 600,
    width: "fit-content",
    lineHeight: "22px",
    display: "flex",
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 16,
    padding: 0,
  },
  [`& .${treeItemClasses.content} > .${treeItemClasses.label} > a`]: {
    color: theme.palette.primary.dark,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 32,
  },
  [`& ul`]: {
    paddingLeft: 0,
    "--y": "calc(var(--x) + 0)",
  },
  [`& li`]: {
    "--x": "calc(var(--y) + 24)",
  },
  ["& a"]: {
    paddingLeft: "calc(1px * var(--x))",
  },
  [`& .${treeItemClasses.label}`]: {
    padding: 0,
    paddingLeft: 0,
  },
  [`& .${treeItemClasses.root}`]: {
    margin: 0,
    paddingLeft: 0,
  },
  [`& .${treeItemClasses.selected}`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  [`& .${treeItemClasses.content} .${treeItemClasses.selected}`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  [`& .${treeItemClasses.selected} > .${treeItemClasses.label} > *`]: {
    color: theme.palette.primary.dark,
  },
}));

const MobileSiteHeader = ({ products }: SiteHeaderProps) => {
  const t = useTranslations("devPortal");
  const { palette } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (
        menuRef.current &&
        isOpen &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(!isOpen);
        event.stopPropagation();
      }
    };
    document.body.addEventListener("click", closeMenu);

    return () => {
      document.body.removeEventListener("click", closeMenu);
    };
  }, [isOpen]);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box
      sx={{
        alignItems: "center",
        direction: "row",
        display: { xs: "flex", sm: "none" },
        flexGrow: 1,
        paddingLeft: 2,
        gap: 4,
        justifyContent: "end",
      }}
    >
      <Button
        variant="naked"
        disableElevation
        onClick={handleClick}
        endIcon={isOpen ? <ArrowDropUp /> : <ArrowDropDown />}
      >
        {t("siteHeader.label")}
      </Button>
      <Box
        ref={menuRef}
        sx={{
          display: isOpen ? "block" : "none",
          backgroundColor: "white",
          top: SITE_HEADER_HEIGHT,
          left: 0,
          padding: "16px 44px 8px 44px",
          position: "fixed",
          width: "100%",
          zIndex: 200,
        }}
      >
        <SimpleTreeView
          slots={{
            collapseIcon: ArrowDropUp,
            expandIcon: ArrowDropDown,
          }}
          multiSelect
        >
          <MobileSiteHeaderStyledTreeItem
            itemId={t("siteHeader.products")}
            label={t("siteHeader.products")}
            disabled={false}
          >
            {products.map((product, index) => {
              return (
                <Typography
                  key={index}
                  variant="body1"
                  component={NextLink}
                  href={`/${product.slug}/overview`}
                  onClick={handleClick}
                  style={{
                    color: palette.primary.dark,
                    display: "block",
                    textDecoration: "none",
                  }}
                >
                  {product.name}
                </Typography>
              );
            })}
          </MobileSiteHeaderStyledTreeItem>

          <MobileSiteHeaderStyledTreeItem
            itemId={"siteHeader.solutions"}
            label={
              <Typography
                component={NextLink}
                variant="body1"
                href={"/solutions"}
                onClick={handleClick}
                style={{
                  color: palette.primary.dark,
                  display: "block",
                  textDecoration: "none",
                  fontWeight: 600,
                  padding: 0,
                }}
              >
                {t("siteHeader.solutions")}
              </Typography>
            }
          />
          <MobileSiteHeaderStyledTreeItem
            itemId={"siteHeader.webinars"}
            label={
              <Typography
                component={NextLink}
                variant="body1"
                href={"/webinars"}
                onClick={handleClick}
                style={{
                  color: palette.primary.dark,
                  display: "block",
                  textDecoration: "none",
                  fontWeight: 600,
                  padding: 0,
                }}
              >
                {t("siteHeader.webinars")}
              </Typography>
            }
          />

          <Divider sx={{ marginTop: -2, marginBottom: 2 }} />
          <MobileUserInfo onClick={handleClick} />
        </SimpleTreeView>
      </Box>
    </Box>
  );
};

export default MobileSiteHeader;
