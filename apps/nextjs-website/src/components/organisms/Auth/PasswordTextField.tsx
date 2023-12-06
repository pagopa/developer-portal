import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  InputProps,
  OutlinedInput,
  Stack,
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { useState, MouseEvent } from 'react';

type PasswordTextFieldProps = {
  id: string;
  label: string;
  hasError?: boolean;
  helperText?: string;
} & Pick<InputProps, 'onChange' | 'value'>;

export const PasswordTextField = ({
  id,
  hasError = false,
  helperText = '',
  label,
  value: password,
  onChange,
}: PasswordTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Stack spacing={2}>
      <FormControl variant='outlined'>
        <InputLabel error={hasError} htmlFor={id} sx={{ top: '-8px' }}>
          {label}
        </InputLabel>
        <OutlinedInput
          id={id}
          name={id}
          required
          type={showPassword ? 'text' : 'password'}
          onChange={onChange}
          error={hasError}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge='end'
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          value={password}
          label={label}
          inputProps={{
            sx: {
              padding: '8.5px 14px',
            },
          }}
        />
        <FormHelperText error={hasError}>{helperText}</FormHelperText>
      </FormControl>
    </Stack>
  );
};
