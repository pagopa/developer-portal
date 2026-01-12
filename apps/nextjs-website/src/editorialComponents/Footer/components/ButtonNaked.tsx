import React from 'react';
import { Button, type ButtonProps } from '@mui/material';

export const ButtonNaked = <C extends React.ElementType>(
  props: ButtonProps<
    C,
    {
      component?: C;
      buttonRef?: React.Ref<HTMLButtonElement>;
      weight?: 'default' | 'light';
    }
  >
): React.ReactElement => {
  const {
    children,
    buttonRef,
    color = 'primary',
    weight = 'default',
    ...rest
  } = props;
  return (
    <Button
      sx={{
        fontWeight: weight === 'default' ? '600' : '400',
        letterSpacing: 0.3,
      }}
      variant='text'
      size='small'
      color={color}
      disableRipple
      disableTouchRipple
      ref={buttonRef}
      {...rest}
    >
      {children}
    </Button>
  );
};
