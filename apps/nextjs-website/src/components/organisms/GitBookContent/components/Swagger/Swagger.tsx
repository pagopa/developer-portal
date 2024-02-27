`use client`;
import Accordion from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { SwaggerProps } from 'gitbook-docs/markdoc/schema/swagger';

import { ReactNode } from 'react';
import { useSpec } from './hooks/useSpec';
import { useTranslations } from 'next-intl';
import { Operations } from './Operations';
import { OpenAPIV3 } from 'openapi-types';
import { styled } from '@mui/material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.75rem' }} />}
    {...props}
  />
))(() => ({
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
}));

const Swagger = ({
  method,
  summary,
  children,
  src,
  path,
}: SwaggerProps<ReactNode>) => {
  const { spec } = useSpec(src);
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
      <AccordionSummary aria-controls='panel2-content' id='panel2-header'>
        <div
          style={{
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography
            sx={{
              backgroundColor: '#008847',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '40px',
              fontSize: 14,
              fontWeight: 700,
              marginBottom: '16px',
              textTransform: 'uppercase',
            }}
          >
            {method}
          </Typography>
          <Typography component={'div'} sx={{ fontWeight: 700, fontSize: 16 }}>
            {summary}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingLeft: 6, paddingRight: 2 }}>
        {children ? (
          <>
            <Typography
              sx={{ fontWeight: 700, fontSize: 16, marginBottom: '16px' }}
            >
              {t('parameters.header')}
            </Typography>
            <div>{children}</div>
          </>
        ) : (
          <Typography
            sx={{ fontWeight: 700, fontSize: 16, marginBottom: '16px' }}
          >
            {t('parameters.empty')}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default Swagger;
