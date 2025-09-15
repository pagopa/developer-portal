"use client";
import LinkButton from "@/components/atoms/LinkButton/LinkButton";
import { Typography, Grid, Stack, Box, useTheme } from "@mui/material";
import Image from "next/image";
import { useMemo } from "react";
import EContainer from "../EContainer/EContainer";
import { useTranslations } from "next-intl";
import type { TypographyVariant } from "@mui/material/styles";

export interface INewsroomItem {
  comingSoonLabel?: string;
  label?: string;
  img?: {
    src: string;
    alt: string;
  };
  title: string;
  date: {
    date?: Date;
    locale?: string;
    options?: Intl.DateTimeFormatOptions;
  };
  href: {
    label: string;
    title?: string;
    link: string;
    translate?: boolean;
  };
  variant?: TypographyVariant;
}

export interface INewsroom {
  py?: number;
  items: INewsroomItem[];
}

const Item = (props: INewsroomItem) => {
  const { variant = "h6" } = props;
  const theme = useTheme();
  const t = useTranslations();

  const {
    comingSoonLabel,
    label,
    img,
    date: {
      date,
      locale = "it-IT",
      options = {
        day: "2-digit",
        month: "long",
        year: "numeric",
      },
    },
    title,
    href,
  } = props;

  return (
    <Grid
      size={{ sm: 12, md: 4 }}
      mb={8}
      minWidth={{ xs: "80vw", md: "auto" }}
      sx={{ display: "flex", flexDirection: "column" }}
    >
      <Box
        position={"relative"}
        sx={{ marginBottom: "16px", overflow: "hidden" }}
      >
        {comingSoonLabel && (
          <Box
            py={0.5}
            px={2}
            top={15}
            right={30}
            position={"absolute"}
            sx={{
              borderRadius: 1,
              backgroundColor: theme.palette.info.main,
            }}
          >
            <Typography fontSize={14} fontWeight={600}>
              {comingSoonLabel}
            </Typography>
          </Box>
        )}
        {img && (
          <Image
            src={img.src}
            alt={img.alt}
            width={0}
            height={0}
            sizes="100vw"
            style={{
              borderRadius: 16,
              width: "100%",
              height: "auto",
              marginBottom: "16px",
            }}
          />
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {date && (
          <Typography
            color="text.secondary"
            fontSize={16}
            fontWeight={400}
            mb={2}
          >
            {new Intl.DateTimeFormat(locale, options).format(date)}
          </Typography>
        )}
        {label && (
          <Box
            sx={{
              borderRadius: 1,
              maxHeight: "24px",
              flexGrow: "0",
              backgroundColor: "#C4DCF5",
              maxWidth: "50%",
              textAlign: "center",
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "inline-block",
            }}
          >
            <Typography fontSize={14} fontWeight={600} sx={{ marginX: "8px" }}>
              {label}
            </Typography>
          </Box>
        )}
      </Box>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: "0",
        }}
      >
        <Typography
          variant={variant}
          sx={{
            fontSize: "1.5rem !important",
            lineHeight: "1.15 !important",
          }}
        >
          {title}
        </Typography>
        <Stack mt={2} direction="row" alignItems="center" color="primary.main">
          <LinkButton
            disabled={!!comingSoonLabel}
            href={href.link}
            label={href.translate ? t(href.label) : href.label}
          />
        </Stack>
      </div>
    </Grid>
  );
};

const Newsroom = (props: INewsroom) => {
  const { items, py = 2 } = props;

  const news = useMemo(
    () => items.map((item, i) => <Item key={i} {...item} />),
    [items],
  );

  return (
    <EContainer containerSx={{ px: { xs: 0 } }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        py={py}
        sx={{
          flexWrap: { xs: "nowrap", md: "wrap" },
          maxWidth: { md: "1280px", lg: "1310px" },
          "&.MuiGrid-container": {
            padding: { xs: "0 32px", lg: 0 },
            marginLeft: { md: "-24px" },
          },
          overflowX: "scroll",
          width: {
            xs: "auto",
            md: "100%",
          },
        }}
      >
        {news}
      </Grid>
    </EContainer>
  );
};

export default Newsroom;
