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
import { MouseEvent, ReactNode, useMemo, useState } from 'react';

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
  const endAdornment = useMemo(
    () => (
      <InputAdornment position='end'>
        <IconButton
          aria-label='toggle password visibility'
          onClick={() => setShowPassword((show) => !show)}
          onMouseDown={(event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
          }}
          edge='end'
          sx={{ color: 'action.active' }}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
    [showPassword]
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
          sx={{ '& .MuiInputBase-input': { fontWeight: 600 } }}
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
