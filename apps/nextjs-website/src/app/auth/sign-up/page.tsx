'use client';
import { translations } from '@/_contents/translations';
import PageNotFound from '@/app/not-found';
import CheckItem from '@/components/molecules/CheckItem/CheckItem';
import ConfirmSignUp from '@/components/organisms/Auth/ConfirmSignUp';
import SignUpForm from '@/components/organisms/Auth/SignUpForm';
import { environment } from '@/config';
import { SignUpSteps } from '@/lib/types/signUpSteps';
import { Box, Grid, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useCallback, useState } from 'react';

const SignUp = () => {
  const {
    auth: { signUp },
  } = translations;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [signUpStep, setSignUpStep] = useState(SignUpSteps.SIGN_UP);

  const onSignUp = useCallback(async () => {
    const result = await Auth.signUp({
      username,
      password,
      attributes: {
        firstName,
        lastName,
        company,
        role,
      },
    });

    setSignUpStep(SignUpSteps.CONFIRM_SIGN_UP);

    return !!result.user;
  }, [company, firstName, lastName, password, role, username]);

  const onBackStep = useCallback(() => {
    setSignUpStep(SignUpSteps.SIGN_UP);
    return null;
  }, []);

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
        spacing={6}
        alignItems='flex-start'
        justifyContent='center'
        my={16}
      >
        <Grid item xs={5}>
          <Typography variant='h4' mb={4}>
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
        <Grid item xs={5}>
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
            <ConfirmSignUp email={username} onBack={onBackStep} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignUp;
