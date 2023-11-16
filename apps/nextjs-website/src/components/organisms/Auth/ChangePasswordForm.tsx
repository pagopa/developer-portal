'use client';
import { IllusDataSecurity } from '@pagopa/mui-italia';
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { translations } from '@/_contents/translations';
import {
  useState,
  MouseEvent,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { passwordMatcher } from '@/helpers/auth.helpers';

interface ChangePasswordFormProps {
  onChangePassword: () => Promise<void>;
  setPassword: Dispatch<SetStateAction<string>>;
  password: string;
}

const ChangePasswordForm = ({
  onChangePassword,
  setPassword,
  password,
}: ChangePasswordFormProps) => {
  const {
    shared,
    auth: { signUp, resetPassword },
  } = translations;

  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordDirty, setIsPasswordDirty] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [password_confirm, setPasswordConfirm] = useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseDownConfirmPassword = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const validatePassword = useCallback(() => {
    setIsPasswordValid(passwordMatcher.test(password));
  }, [password]);

  useEffect(() => {
    validatePassword();
  }, [password, validatePassword]);

  const validateForm = useCallback(() => {
    const areFieldsValid = [password, password_confirm].every(
      (value) => value && value.trim().length > 0
    );
    const isPasswordEqual = password === password_confirm;

    setIsFormValid(areFieldsValid && isPasswordEqual && isPasswordValid);
  }, [isPasswordValid, password, password_confirm]);

  useEffect(() => {
    validateForm();
  }, [validateForm, isPasswordValid]);

  return (
    <Box
      component='section'
      sx={{
        width: '90vw',
        '@media (min-width: 1200px)': {
          width: '35vw',
        },
      }}
    >
      <Card variant='elevation' elevation={8}>
        <Grid container justifyContent='center'>
          <Grid item xs={10}>
            <Stack pt={4} display='flex' alignItems='center'>
              <IllusDataSecurity />
            </Stack>
            <Typography variant='h4' pt={8} mb={4} textAlign='center'>
              {resetPassword.newPassword}
            </Typography>
            <Stack spacing={2} mb={2}>
              <FormControl variant='outlined'>
                <InputLabel htmlFor='password-input' sx={{ top: '-8px' }}>
                  {shared.password}
                </InputLabel>
                <OutlinedInput
                  id='password-input'
                  required
                  type={showPassword ? 'text' : 'password'}
                  onChange={({ target: { value } }) => setPassword(value)}
                  onBlur={() => setIsPasswordDirty(true)}
                  error={isPasswordDirty && !isPasswordValid}
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
                  label={shared.password}
                  inputProps={{
                    sx: {
                      padding: '8.5px 14px',
                    },
                  }}
                />
                <FormHelperText error={isPasswordDirty && !isPasswordValid}>
                  {signUp.passwordPolicy}
                </FormHelperText>
              </FormControl>
            </Stack>
            <Stack spacing={2} mb={2}>
              <FormControl variant='outlined'>
                <InputLabel
                  htmlFor='confirm-password-input'
                  sx={{ top: '-8px' }}
                >
                  {shared.confirmPassword}
                </InputLabel>
                <OutlinedInput
                  id='confirm-password-input'
                  type={showPassword ? 'text' : 'password'}
                  required
                  onChange={({ target: { value } }) =>
                    setPasswordConfirm(value)
                  }
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle confirm password visibility'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  value={password_confirm}
                  label={shared.confirmPassword}
                  error={isPasswordDirty && password !== password_confirm}
                  inputProps={{
                    sx: {
                      padding: '8.5px 14px',
                    },
                  }}
                />
              </FormControl>
            </Stack>
            <Stack spacing={4} pt={4} pb={2}>
              <Stack direction='row' justifyContent='center'>
                <Button
                  variant='contained'
                  onClick={onChangePassword}
                  disabled={!isFormValid}
                >
                  {resetPassword.send}
                </Button>
              </Stack>
            </Stack>
            <Divider />
            <Stack
              pt={4}
              pb={8}
              display='flex'
              alignItems='center'
              justifyContent='center'
              flexDirection='row'
            >
              <Typography variant='caption-semibold' mr={1}>
                {resetPassword.rememberPassword}
              </Typography>
              <Link href='/auth/login'>{shared.login}</Link>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ChangePasswordForm;
