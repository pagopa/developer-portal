import { Children, ReactNode, cloneElement, isValidElement } from 'react';
import { Box } from '@mui/material';
import { StepperProps } from 'gitbook-docs/markdoc/schema/stepper';

const Stepper = ({ children }: StepperProps<ReactNode>) => (
  <Box sx={{ gap: 0 }}>
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
