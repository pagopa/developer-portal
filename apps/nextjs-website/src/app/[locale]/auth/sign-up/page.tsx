'use client';
import CheckItem from '@/components/molecules/CheckItem/CheckItem';
import ConfirmSignUp from '@/components/organisms/Auth/ConfirmSignUp';
import SignUpForm from '@/components/organisms/Auth/SignUpForm';
import { SignUpSteps } from '@/lib/types/signUpSteps';
import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useSearchParams } from 'next/navigation';
import { SignUpUserData } from '@/lib/types/sign-up';
import { useTranslations } from 'next-intl';
import { generateSignUpData } from '@/helpers/auth.helpers';
import { useAuthenticatedUserRedirect } from '@/helpers/user.helper';
import { useState, Suspense } from 'react';
import { signUpAdvantages } from '@/config';
import Spinner from '@/components/atoms/Spinner/Spinner';

const SignUpContent = () => {
  const loading = useAuthenticatedUserRedirect();

  const params = useSearchParams();
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');
  const signUp = useTranslations('auth.signUp');

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userAlreadyExist, setUserAlreadyExist] = useState(false);
  const [signUpStep, setSignUpStep] = useState(
    params.get('step') || SignUpSteps.SIGN_UP
  );

  const onBackStep = () => {
    setSignUpStep(SignUpSteps.SIGN_UP);
  };

  const onSignUp = (userData: SignUpUserData) => {
    setUserAlreadyExist(false);
    setSubmitting(true);
    Auth.signUp(generateSignUpData(userData))
      .then(() => {
        setEmail(userData.username);
        setSignUpStep(SignUpSteps.CONFIRM_SIGN_UP);
      })
      .catch((error) => {
        setUserAlreadyExist(error.code === 'UsernameExistsException');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (loading) return null;

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
              <SignUpForm
                userAlreadyExist={userAlreadyExist}
                submitting={submitting}
                onSignUp={onSignUp}
              />
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

const SignUp = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <SignUpContent />
    </Suspense>
  );
};

export default SignUp;
