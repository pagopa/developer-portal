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
import { MouseEvent, ReactNode, useState } from 'react';

type PasswordTextFieldProps = {
  id: string;
  label: string;
  hasError?: boolean;
  helperText?: ReactNode;
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

  const endAdornment = useMemo ( () => (
      <InputAdornment position='end'>
      <IconButton
        aria-label='toggle password visibility'
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
        edge='end'
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>), [showPassword, handleClickShowPassword, handleMouseDownPassword ])
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
  );

  const type = showPassword ? 'text' : 'password';

  return (
    <Stack spacing={2}>
      <FormControl variant='outlined' size='small'>
        <TextField
          error={hasError}
          id={id}
          inputProps={{ 'aria-label': id }}
          InputProps={{ endAdornment }}
          label={label}
          name={id}
          required
          size='small'
          type={type}
          value={password}
          onChange={onChange}
        />
        {hasError && (
          <FormHelperText error={hasError}>{helperText}</FormHelperText>
        )}
      </FormControl>
    </Stack>
  );
};
