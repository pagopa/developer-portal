'use client';
import { Typography } from '@mui/material';
import { SwaggerDescriptionProps } from 'gitbook-docs/markdoc/schema/swagger';
import { ReactNode } from 'react';

const SwaggerDescription = ({
  children,
}: SwaggerDescriptionProps<ReactNode>) => {
  return (
    <Typography
      sx={{
        fontWeight: 700,
        fontSize: 16,
        marginTop: '16px',
        marginBottom: '16px',
      }}
      component={'div'}
    >
      {children}
    </Typography>
  );
};

export default SwaggerDescription;
