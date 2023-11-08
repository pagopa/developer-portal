'use client';
import { translations } from '@/_contents/translations';
import PageNotFound from '@/app/not-found';
import CheckItem from '@/components/molecules/CheckItem/CheckItem';
import ConfirmSignUp from '@/components/organisms/Auth/ConfirmSignUp';
import SignUpForm from '@/components/organisms/Auth/SignUpForm';
import { environment } from '@/config';
import { SignUpSteps } from '@/lib/types/signUpSteps';
import {
  Alert,
  Box,
  Grid,
  Snackbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Auth } from 'aws-amplify';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const SignUp = () => {
  const {
    auth: { signUp },
  } = translations;
  const params = useSearchParams();
  const router = useRouter();
  const userInfo =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('userInfo') || '{}')
      : {};

  const isSmallScreen = useMediaQuery('(max-width: 1000px)');
  const [firstName, setFirstName] = useState(userInfo?.firstName || '');
  const [lastName, setLastName] = useState(userInfo?.lastName || '');
  const [username, setUsername] = useState(params.get('email') || '');
  const [password, setPassword] = useState(userInfo?.password || '');
  const [confirmPassword, setConfirmPassword] = useState(
    userInfo?.password || ''
  );
  const [company, setCompany] = useState(userInfo?.company || '');
  const [role, setRole] = useState(userInfo?.role || '');
  const [mailinglistAccepted, setMailinglistAccepted] = useState(
    userInfo?.mailinglistAccepted || false
  );
  const [signUpStep, setSignUpStep] = useState(
    params.get('step') || SignUpSteps.SIGN_UP
  );
  const [error, setError] = useState<string | null>(null);

  const onSignUp = useCallback(async () => {
    const result = await Auth.signUp({
      username,
      password,
      attributes: {
        given_name: firstName,
        family_name: lastName,
        'custom:privacy_accepted': 'true',
        'custom:mailinglist_accepted': mailinglistAccepted ? 'true' : 'false',
        'custom:job_role': role,
        'custom:company_type': company,
      },
    }).catch((error) => {
      setError(error.message);
      return false;
    });

    if (typeof result === 'boolean') {
      return result;
    } else {
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          username,
          password,
          firstName,
          lastName,
          company,
          role,
          mailinglistAccepted,
        })
      );
      router.replace(
        `/auth/sign-up?email=${username}&step=${SignUpSteps.CONFIRM_SIGN_UP}`
      );
      setSignUpStep(SignUpSteps.CONFIRM_SIGN_UP);
      return !!result.user;
    }
  }, [
    company,
    firstName,
    lastName,
    mailinglistAccepted,
    password,
    role,
    router,
    username,
  ]);

  const onBackStep = useCallback(() => {
    router.replace(
      `/auth/sign-up?email=${username}&step=${SignUpSteps.SIGN_UP}`
    );
    setSignUpStep(SignUpSteps.SIGN_UP);
    return null;
  }, [router, username]);

  const onResendEmail = useCallback(async () => {
    await Auth.resendSignUp(username);
    return null;
  }, [username]);

  useEffect(() => {
    localStorage.removeItem('userInfo');
  }, []);

  if (environment === 'prod') {
    return <PageNotFound />;
  }

  return (
    <>
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
            <Typography variant='h6' mb={4} mt={isSmallScreen ? 10 : 0}>
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
                mailinglistAccepted={mailinglistAccepted}
                setMailinglistAccepted={setMailinglistAccepted}
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
      <Snackbar
        open={!!error}
        autoHideDuration={2000}
        onClose={() => setError(null)}
      >
        <Alert severity='error'>{error}</Alert>
      </Snackbar>
    </>
  );
};

export default SignUp;
