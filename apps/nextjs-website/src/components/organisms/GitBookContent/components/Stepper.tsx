// components/Steppers.tsx
import { ReactNode, Children, cloneElement, isValidElement } from 'react';
import { Box } from '@mui/material';
export type StepperProps<A> = {
  readonly children: A;
};

const Stepper = ({ children }: StepperProps<ReactNode>) => (
  <Box sx={{ marginY: 4 }}>
    {/* Map over children to inject the stepNumber prop */}
    {Children.map(children, (child, index) => {
      if (isValidElement(child)) {
        // Clone the element to add the stepNumber prop
        return cloneElement(child, { stepNumber: index + 1 } as any);
      }
      return child;
    })}
  </Box>
);

export default Stepper;
