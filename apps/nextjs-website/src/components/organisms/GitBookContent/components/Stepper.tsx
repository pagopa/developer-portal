// components/Stepper.tsx
import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

export type StepperProps<A> = {
  readonly title: string;
  readonly children: A;
  // This prop is injected by the parent Steppers component, not from Markdoc
  readonly stepNumber?: number;
};

const Stepper = ({ title, children, stepNumber }: StepperProps<ReactNode>) => (
  <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
    {/* The numbered circle */}
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontWeight: 'bold',
      }}
    >
      {stepNumber}
    </Box>
    {/* The content of the step */}
    <Box>
      <Typography variant='h6' component='h3' sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      {children}
    </Box>
  </Box>
);

export default Stepper;
