import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { ReactNode } from 'react';

type ExpandableProps = {
  title: string;
  children: ReactNode;
};

const Expandable = ({ title, children }: ExpandableProps) => (
  <Accordion>
    <AccordionSummary>{title}</AccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </Accordion>
);

export default Expandable;
