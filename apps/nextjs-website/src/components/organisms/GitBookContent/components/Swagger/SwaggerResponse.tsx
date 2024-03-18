'use-client';
import { Typography } from '@mui/material';
import { SwaggerResponseProps } from 'gitbook-docs/markdoc/schema/swagger';

import { ReactNode } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const SwaggerResponse = ({
  status,
  description,
  children,
}: SwaggerResponseProps<ReactNode>) => {
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
          <div style={{ display: 'flex' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '6px',
                backgroundColor: '#008847',
                marginTop: '7px',
                marginLeft: '10px',
                marginRight: '8px',
              }}
            ></div>
            <Typography sx={{ marginBottom: '16px' }}>{status}</Typography>
          </div>

          <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
            {description}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div>{children}</div>
      </AccordionDetails>
    </Accordion>
  );
};

export default SwaggerResponse;
