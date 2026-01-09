import { Circle, KeyboardArrowRight } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  Box,
  AccordionSummary as MuiAccordionSummary,
  Typography,
  styled,
} from '@mui/material';
import { OpenAPIV3 } from 'openapi-types';

import { SchemaWithExample } from './SchemaWithExample';
import { useState } from 'react';

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    color: theme.palette.primary.main,
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    alignItems: 'center',
  },
}));

function getResponseCodeColor(code: string) {
  const codeNumber = Number(code);
  if (codeNumber >= 200 && codeNumber < 300) {
    return 'success';
  } else if (codeNumber >= 300 && codeNumber < 400) {
    return 'primary';
  } else if (codeNumber >= 400 && codeNumber < 500) {
    return 'warning';
  } else {
    return 'error';
  }
}

type ResponseProps = OpenAPIV3.ResponseObject & {
  code: string;
};

export const Response = ({ code, content, description }: ResponseProps) => {
  const [open, setOpen] = useState(false);
  const response = content?.['application/json'];
  const codeColor = getResponseCodeColor(code);
  const hasDetails = !!response;
  const expandIcon = hasDetails ? (
    <KeyboardArrowRight sx={{ fontSize: '1.125rem' }} />
  ) : undefined;

  const handleToggle = () => {
    if (hasDetails) {
      setOpen(!open);
    }
  };

  return (
    <Accordion expanded={open} onChange={handleToggle}>
      <AccordionSummary expandIcon={expandIcon}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: 200 }}>
          <Circle sx={{ fontSize: 14, mr: 2 }} color={codeColor} />
          <Typography sx={{ mr: 2, fontWeight: 'bold' }}>{code}</Typography>
        </Box>
        <Typography variant='body2'>{description}</Typography>
      </AccordionSummary>
      {hasDetails && (
        <AccordionDetails>
          <SchemaWithExample {...(response as OpenAPIV3.MediaTypeObject)} />
        </AccordionDetails>
      )}
    </Accordion>
  );
};
