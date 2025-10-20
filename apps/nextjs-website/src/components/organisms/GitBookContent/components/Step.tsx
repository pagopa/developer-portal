import {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
} from 'react';
import { Box } from '@mui/material';
import { StepProps } from 'gitbook-docs/markdoc/schema/stepper';

const getChildKey = (child: ReactNode, index: number) =>
  isValidElement(child) && child.key !== null ? child.key : index;

const Step = ({ stepNumber, children }: StepProps<ReactNode>) => {
  const childArray = Children.toArray(children);

  // eslint-disable-next-line functional/no-let
  let headingElement: ReactNode | null = null;
  const content: ReactNode[] = [];

  childArray.forEach((child) => {
    if (
      headingElement === null &&
      isValidElement(child) &&
      'level' in child.props &&
      child.props.level === 3
    ) {
      headingElement = child;
      return;
    }
    // eslint-disable-next-line functional/immutable-data
    content.push(child);
  });

  const headingWithNumber =
    headingElement !== null ? (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        {typeof stepNumber === 'number' ? (
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
              fontWeight: 600,
            }}
          >
            {stepNumber}
          </Box>
        ) : null}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {cloneElement(headingElement as ReactElement)}
        </Box>
      </Box>
    ) : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {headingWithNumber}
      {content.map((child, index) => (
        <Box
          sx={{ marginLeft: { sm: 0, md: 6 } }}
          key={getChildKey(child, index)}
        >
          {child}
        </Box>
      ))}
    </Box>
  );
};

export default Step;
