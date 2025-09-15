"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import { Compress, Expand, ExpandMore } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { QuestionsAndAnswer } from "@/lib/types/webinar";
import BlocksRendererClient from "../BlocksRendererClient/BlocksRendererClient";
import EContainer from "@/editorialComponents/EContainer/EContainer";

export type QuestionsAndAnswersProps = {
  readonly items: QuestionsAndAnswer[];
  readonly minQuestionsToShow?: number;
  readonly maxQuestionsToShow?: number;
};

const QuestionsAndAnswers = ({
  items,
  minQuestionsToShow = 5,
  maxQuestionsToShow,
}: QuestionsAndAnswersProps) => {
  const theme = useTheme();
  const t = useTranslations();
  const [showMore, toggleShowMore] = useState(false);
  const questionsToShow = showMore
    ? maxQuestionsToShow || items.length
    : minQuestionsToShow;

  const [expanded, setExpanded] = React.useState<number | false>(false);

  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const cssIdSelectorRegex = /^(?:[-_a-zA-Z0-9]|\\[0-9a-fA-F]{1,6}\s?|\\.)+$/;

  useEffect(() => {
    const path = window.location.hash;
    if (path && path.includes("#")) {
      const id = path.replace("#", "");
      if (id && cssIdSelectorRegex.test(id)) {
        document
          .querySelector("#" + id)
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }
  });

  return (
    <Box
      id={t("webinar.webinarsSection.questionsAndAnswers.anchorId")}
      pt={10}
      pb={10}
      sx={{ backgroundColor: theme.palette.grey[50] }}
    >
      <EContainer>
        <Typography variant="h4" sx={{ mb: 4, width: "100%" }}>
          {t("webinar.webinarsSection.questionsAndAnswers.title")}
        </Typography>
        {[...items].map((item, index) => (
          <Accordion
            key={index}
            sx={{
              display: index > questionsToShow - 1 ? "none" : "auto",
              marginBottom: 2,
              borderTop: "none",
              borderRadius: "4px",
              "::before": { display: "none" },
              width: "100%",
            }}
            disableGutters
            expanded={expanded === index}
            onChange={handleChange(index)}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMore color="primary" sx={{ mr: 1.5, ml: 1.5 }} />
              }
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "21px",
                  my: 2,
                }}
              >
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <BlocksRendererClient
                content={item.answer}
                paragraphSx={{ mb: 0, fontSize: "16px", lineHeight: "21px" }}
              />
            </AccordionDetails>
          </Accordion>
        ))}
        {items.length > minQuestionsToShow && (
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <Button
              sx={{
                mx: "auto",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "21px",
              }}
              onClick={() => toggleShowMore((prev) => !prev)}
            >
              {showMore
                ? t("webinar.webinarsSection.questionsAndAnswers.showLess")
                : t("webinar.webinarsSection.questionsAndAnswers.showMore")}
              {showMore ? (
                <Compress sx={{ ml: 1, height: "20px", width: "20px" }} />
              ) : (
                <Expand sx={{ ml: 1, height: "20px", width: "20px" }} />
              )}
            </Button>
          </Box>
        )}
      </EContainer>
    </Box>
  );
};

export default QuestionsAndAnswers;
