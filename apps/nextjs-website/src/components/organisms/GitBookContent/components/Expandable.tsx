import Paragraph from './Paragraph';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import {
  ExpandableProps,
  ExpandableSummaryProps,
} from 'gitbook-docs/markdoc/schema/details';
import { ReactNode } from 'react';

const Expandable = ({ children }: ExpandableProps<ReactNode>) =>
  children && (
    <Accordion disableGutters variant='outlined' sx={{ my: 2 }}>
      {children}
    </Accordion>
  );

export const ExpandableSummary = ({
  children,
}: ExpandableSummaryProps<ReactNode>) => (
  <AccordionSummary>
    <Paragraph>{children}</Paragraph>
  </AccordionSummary>
);
export const ExpandableDetails = AccordionDetails;

export default Expandable;
