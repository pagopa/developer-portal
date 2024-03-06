'use client';
import CheckItem from '@/components/molecules/CheckItem/CheckItem';
import ConfirmSignUp from '@/components/organisms/Auth/ConfirmSignUp';
import SignUpForm from '@/components/organisms/Auth/SignUpForm';
import { SignUpSteps } from '@/lib/types/signUpSteps';
import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { SignUpUserData } from '@/lib/types/sign-up';
import { useTranslations } from 'next-intl';
import { signUpAdvantages } from '@/_contents/auth';
import AuthStatus from '@/components/organisms/Auth/AuthStatus';
import { generateSignUpData } from '@/helpers/auth.helpers';

const SignUp = () => {
  const params = useSearchParams();
  const router = useRouter();
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');
  const signUp = useTranslations('auth.signUp');

  const [submitting, setSubmitting] = useState(false);
  const [userAlreadyExist, setUserAlreadyExist] = useState(false);
  const [signUpStep, setSignUpStep] = useState(
    params.get('step') || SignUpSteps.SIGN_UP
  );

  const email = params.get('email') || '';

  const goToConfirmSignUp = useCallback(
    (email: string) => {
      router.replace(
        `/auth/sign-up?email=${encodeURIComponent(email)}&step=${
          SignUpSteps.CONFIRM_SIGN_UP
        }`
      );
      setSignUpStep(SignUpSteps.CONFIRM_SIGN_UP);
    },
    [router]
  );

  const onBackStep = useCallback(() => {
    router.replace(
      `/auth/sign-up?email=${encodeURIComponent(email)}&step=${
        SignUpSteps.SIGN_UP
      }`
    );
    setSignUpStep(SignUpSteps.SIGN_UP);
    return null;
  }, [router, email]);

  const onSignUp = useCallback(
    (userData: SignUpUserData) => {
      setUserAlreadyExist(false);
      setSubmitting(true);
      Auth.signUp(generateSignUpData(userData))
        .then(() => {
          goToConfirmSignUp(userData.username);
        })
        .catch((error) => {
          if (error.code === 'UsernameExistsException') {
            setUserAlreadyExist(true);
          } else {
            setUserAlreadyExist(false);
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [goToConfirmSignUp]
  );

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
              {signUp('whyCreateAccount')}
            </Typography>
            {signUpAdvantages.map((advantage, index) => {
              return (
                <CheckItem
                  key={index}
                  title={signUp(`advantages.${advantage}.title`)}
                  description={signUp(`advantages.${advantage}.text`)}
                  isComingSoon={
                    signUp(`advantages.${advantage}.isComingSoon`) === 'true'
                  }
                />
              );
            })}
          </Grid>
          <Grid item xs={isSmallScreen ? 1 : 5}>
            {signUpStep === SignUpSteps.SIGN_UP && (
              <AuthStatus>
                <SignUpForm
                  userAlreadyExist={userAlreadyExist}
                  submitting={submitting}
                  onSignUp={onSignUp}
                />
              </AuthStatus>
            )}
            {signUpStep === SignUpSteps.CONFIRM_SIGN_UP && (
              <ConfirmSignUp email={email} onBack={onBackStep} />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SignUp;
