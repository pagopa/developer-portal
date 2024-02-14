import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { SwaggerProps } from 'gitbook-docs/markdoc/schema/swagger';

import { ReactNode } from 'react';

const Swagger = ({ method, summary, children }: SwaggerProps<ReactNode>) => {
  return (
    <Accordion
      sx={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginBottom: '16px',
      }}
    >
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls='panel2-content'
        id='panel2-header'
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography
            sx={{
              backgroundColor: '#008847',
              color: 'white',
              padding: '4px 16px',
              borderRadius: '40px',
              marginBottom: '16px',
            }}
          >
            {method}
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
            {summary}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div>{children}</div>
      </AccordionDetails>
    </Accordion>
  );
};

export default Swagger;
