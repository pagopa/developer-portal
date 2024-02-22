'use-client';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { SwaggerProps } from 'gitbook-docs/markdoc/schema/swagger';

import { ReactNode } from 'react';
import { useSpec } from './hooks/useSpec';
import { useTranslations } from 'next-intl';
import { Operations } from './Operations';
import { OpenAPIV3 } from 'openapi-types';

const Swagger = ({
  method,
  summary,
  children,
  src,
  path,
}: SwaggerProps<ReactNode>) => {
  const { spec, loading } = useSpec(src);
  const t = useTranslations('swagger');

  if (spec && src) {
    const validOperations = { [path]: [method] as OpenAPIV3.HttpMethods[] };
    return (
      <Operations
        spec={spec as OpenAPIV3.Document}
        validOperations={validOperations}
      />
    );
  }

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
