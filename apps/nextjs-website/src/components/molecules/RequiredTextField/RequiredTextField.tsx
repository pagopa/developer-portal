'use client';
import { TextField, TextFieldProps } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTheme } from '@mui/material';

export type ValidatorFunction = (value: string) => {
  valid: boolean;
  error: string;
};

type RequiredTextFieldProps = Partial<TextFieldProps> & {
  value: string;
  customValidators?: ValidatorFunction[];
};

const RequiredTextField: FC<RequiredTextFieldProps> = ({
  label,
  value,
  onChange,
  helperText,
  customValidators,
  type = 'text',
  error,
  ...rest
}) => {
  const [isDirty, setIsDirty] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errorText, setErrorText] = useState(helperText);
  console.log('Helper text', helperText, 'Error text', errorText);
  const { palette } = useTheme();

  useEffect(() => {
    if (helperText) {
      setErrorText(helperText);
    }
  }, [helperText]);

  const validateField = useCallback(() => {
    if (!value || value?.trim().length === 0) {
      setIsValid(false);
      setErrorText(helperText);
    } else {
      setIsValid(true);
    }
  }, [helperText, value]);

  useEffect(() => {
    validateField();

    if (customValidators) {
      const { valid, error } = customValidators.reduce(
        (acc, validator) => {
          const { valid, error } = validator(value);
          return valid ? acc : { valid, error };
        },
        { valid: true, error: '' }
      );
      setIsValid(valid);
      setErrorText(error);
    }
  }, [value, validateField, customValidators]);

  return (
    <TextField
      label={label}
      variant='outlined'
      size='small'
      required
      type={type}
      value={value}
      onChange={onChange}
      onBlur={() => setIsDirty(true)}
      sx={{
        backgroundColor: palette.background.paper,
        width: '100%',
      }}
      error={isDirty && (!isValid || error)}
      helperText={isDirty && (!isValid || error) && errorText}
      {...rest}
    />
  );
};

export default RequiredTextField;
