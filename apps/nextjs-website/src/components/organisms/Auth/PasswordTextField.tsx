import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputProps,
  Stack,
  TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { MouseEvent, useState } from 'react';

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
      <FormControl variant='outlined' size={'small'}>
        <TextField
          id={id}
          name={id}
          required
          type={showPassword ? 'text' : 'password'}
          onChange={onChange}
          error={hasError}
          InputProps={{
            endAdornment: (
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
            ),
          }}
          value={password}
          label={label}
          size={'small'}
        />
        <FormHelperText error={hasError}>{helperText}</FormHelperText>
      </FormControl>
    </Stack>
  );
};
