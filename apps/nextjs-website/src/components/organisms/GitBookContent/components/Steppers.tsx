// components/Steppers.tsx
import { ReactNode, Children, cloneElement, isValidElement } from 'react';
import { Box } from '@mui/material';
export type SteppersProps<A> = {
  readonly children: A;
};

const Steppers = ({ children }: SteppersProps<ReactNode>) => (
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

export default Steppers;
