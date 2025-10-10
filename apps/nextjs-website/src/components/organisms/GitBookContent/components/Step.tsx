// components/Stepper.tsx

import { ReactNode } from 'react';
import { Box } from '@mui/material';

export type StepProps<A> = {
  readonly title: string;
  readonly children: A;
  // This prop is injected by the parent Steppers component, not from Markdoc
  readonly stepNumber?: number;
};

const Step = (props: StepProps<ReactNode>) => (
  <Box
    sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 3 }}
  >
    {JSON.stringify(Object.keys(props), null, 2)}
    {(props.children! as any[]).map((children, index) => (
      <div key={index}>{children}</div>
    ))}
  </Box>
);

export default Step;
