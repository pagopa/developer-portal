import React, { ReactNode } from 'react';
import Paragraph from './Paragraph';
import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionProps,
  AccordionSummary as MuiAccordionSummary,
  AccordionSummaryProps,
  styled,
} from '@mui/material';
import {
  ExpandableProps,
  ExpandableSummaryProps,
} from 'gitbook-docs/markdoc/schema/details';
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
    paddingTop: '15px',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  paddingTop: 0,
  paddingLeft: '42px',
  paddingBottom: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

const Expandable = ({ children }: ExpandableProps<ReactNode>) => {
  return (
    children && (
      <Accordion
        disableGutters
        variant='outlined'
        id='expandable'
        sx={{ my: 2 }}
      >
        {children}
      </Accordion>
    )
  );
};

export const ExpandableSummary = ({
  children,
}: ExpandableSummaryProps<ReactNode>) => (
  <AccordionSummary>
    <Paragraph>{children}</Paragraph>
  </AccordionSummary>
);
export const ExpandableDetails = AccordionDetails;

export default Expandable;
