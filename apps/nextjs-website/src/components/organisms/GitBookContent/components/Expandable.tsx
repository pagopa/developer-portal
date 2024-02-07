import React, { ReactNode } from 'react';
import Paragraph from './Paragraph';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import {
  ExpandableProps,
  ExpandableSummaryProps,
} from 'gitbook-docs/markdoc/schema/details';
import { styled } from '@mui/material';
import { KeyboardArrowRight } from '@mui/icons-material';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props}>
    {props.children}
  </MuiAccordion>
))(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 4,
  '&.MuiAccordion-root::before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    border: `1px solid ${theme.palette.primary.main}`,
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<KeyboardArrowRight sx={{ fontSize: '1.125rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'transparent',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    color: theme.palette.primary.main,
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginTop: 0,
    marginLeft: theme.spacing(1),
    marginBottom: 0,
    marginRight: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  paddingTop: 0,
  paddingLeft: '42px',
  paddingBottom: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

const Expandable = ({ children }: ExpandableProps<ReactNode>) => {
  console.log('çhildren', children);

  // if children is array and an item is string wrap it with paragraph
  if (Array.isArray(children)) {
    children = children.map((child, index) =>
      typeof child === 'string' ? <Paragraph key={index}>{child}</Paragraph> : child
    );
  }

  return children && (
    <Accordion disableGutters variant='outlined' id='expandable' sx={{ my: 2 }}>
      {children}
    </Accordion>
  );
}


export const ExpandableSummary = ({
  children,
}: ExpandableSummaryProps<ReactNode>) => (
  <AccordionSummary>
    <Paragraph>{children}</Paragraph>
  </AccordionSummary>
);
export const ExpandableDetails = AccordionDetails;

export default Expandable;
