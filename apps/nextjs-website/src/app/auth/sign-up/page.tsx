'use client';
import { translations } from '@/_contents/translations';
import PageNotFound from '@/app/not-found';
import CheckItem from '@/components/molecules/CheckItem/CheckItem';
import ConfirmSignUp from '@/components/organisms/Auth/ConfirmSignUp';
import SignUpForm from '@/components/organisms/Auth/SignUpForm';
import { environment } from '@/config';
import { SignUpSteps } from '@/lib/types/signUpSteps';
import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useCallback, useState } from 'react';

const SignUp = () => {
  const {
    auth: { signUp },
  } = translations;

  const isSmallScreen = useMediaQuery('(max-width: 1000px)');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [signUpStep, setSignUpStep] = useState(SignUpSteps.SIGN_UP);

  const onSignUp = useCallback(async () => {
    // TODO: Add company and role to user attributes
    const result = await Auth.signUp({
      username,
      password,
      attributes: {
        given_name: firstName,
        family_name: lastName,
      },
    }).catch(() => {
      return false;
    });

    if (typeof result === 'boolean') {
      return result;
    } else {
      setSignUpStep(SignUpSteps.CONFIRM_SIGN_UP);

      return !!result.user;
    }
  }, [firstName, lastName, password, username]);

  const onBackStep = useCallback(() => {
    setSignUpStep(SignUpSteps.SIGN_UP);
    return null;
  }, []);

  const onResendEmail = useCallback(async () => {
    await Auth.resendSignUp(username);
    return null;
  }, [username]);

  if (environment === 'prod') {
    return <PageNotFound />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/images/hero.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom right',
      }}
    >
      <Grid
        container
        spacing={isSmallScreen ? 0 : 1}
        alignItems={isSmallScreen ? 'center' : 'flex-start'}
        justifyContent='center'
        direction={isSmallScreen ? 'column-reverse' : 'row'}
        mx={isSmallScreen ? 3 : 20}
        my={isSmallScreen ? 3 : 15}
      >
        <Grid item xs={isSmallScreen ? 1 : 5}>
          <Typography variant='h4' mb={4} mt={4}>
            {signUp.whyCreateAccount}
          </Typography>
          {signUp.advantages.map((advantage, index) => {
            return (
              <CheckItem
                key={index}
                title={`Vantaggio ${index}`}
                description={advantage}
              />
            );
          })}
        </Grid>
        <Grid item xs={isSmallScreen ? 1 : 5}>
          {signUpStep === SignUpSteps.SIGN_UP && (
            <SignUpForm
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              company={company}
              setCompany={setCompany}
              role={role}
              setRole={setRole}
              onSignUp={onSignUp}
            />
          )}
          {signUpStep === SignUpSteps.CONFIRM_SIGN_UP && (
            <ConfirmSignUp
              email={username}
              onBack={onBackStep}
              onResendEmail={onResendEmail}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignUp;
