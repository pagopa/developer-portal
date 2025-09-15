"use client";
import React from "react";
import SectionTitle from "@/components/molecules/SectionTitle/SectionTitle";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Webinar } from "@/lib/types/webinar";
import WebinarListItem from "@/components/molecules/WebinarListItem/WebinarListItem";
import EContainer from "@/editorialComponents/EContainer/EContainer";
import { useTranslations } from "next-intl";
import LinkButton from "@/components/atoms/LinkButton/LinkButton";

type PastWebinarsProps = {
  webinars: Webinar[];
};

const PastWebinarsShowcase = ({ webinars }: PastWebinarsProps) => {
  const t = useTranslations("webinar.pastWebinars");

  return (
    <Box py={5}>
      <SectionTitle title={t("title")} />

      <EContainer>
        <Box pb={4}>
          <Typography variant="body1">{t("description")}</Typography>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            color="primary.main"
          >
            <LinkButton href={"/webinars"} label={t("cta")} />
          </Stack>
        </Box>
        <Box pb={4} width={"100%"}>
          <Grid container spacing={4}>
            {webinars.map((webinar, i) => (
              <WebinarListItem webinar={webinar} key={i} />
            ))}
          </Grid>
        </Box>
      </EContainer>
    </Box>
  );
};

export default PastWebinarsShowcase;
