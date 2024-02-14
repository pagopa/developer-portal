'use client';
import CheckItem from '@/components/molecules/CheckItem/CheckItem';
import ConfirmSignUp from '@/components/organisms/Auth/ConfirmSignUp';
import SignUpForm from '@/components/organisms/Auth/SignUpForm';
import { SignUpSteps } from '@/lib/types/signUpSteps';
import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { SignUpUserData } from '@/lib/types/sign-up';
import { useTranslations } from 'next-intl';
import { signUpAdvantages } from '@/_contents/auth';

const SignUp = () => {
  const params = useSearchParams();
  const router = useRouter();
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');
  const signUp = useTranslations('auth.signUp');

  const [userData, setUserData] = useState<SignUpUserData>({
    username: decodeURIComponent(params.get('email') || ''),
    password: '',
    firstName: '',
    lastName: '',
    mailinglistAccepted: false,
    role: '',
    company: '',
    confirmPassword: '',
  });

  const [signUpStep, setSignUpStep] = useState(
    params.get('step') || SignUpSteps.SIGN_UP
  );

  const [userAlreadyExist, setUserAlreadyExist] = useState(false);

  const goToConfirmSignUp = useCallback(() => {
    router.replace(
      `/auth/sign-up?email=${encodeURIComponent(userData.username)}&step=${
        SignUpSteps.CONFIRM_SIGN_UP
      }`
    );
    setSignUpStep(SignUpSteps.CONFIRM_SIGN_UP);
  }, [router, userData.username]);

  const onSignUp = useCallback(async () => {
    setUserAlreadyExist(false);
    const {
      company,
      firstName,
      lastName,
      password,
      role,
      username,
      mailinglistAccepted,
    } = userData;

    const result = await Auth.signUp({
      username: username,
      password: password,
      attributes: {
        given_name: firstName,
        family_name: lastName,
        'custom:privacy_accepted': 'true',
        'custom:mailinglist_accepted': mailinglistAccepted ? 'true' : 'false',
        'custom:job_role': role,
        'custom:company_type': company,
      },
    }).catch((error) => {
      if (error.code === 'UsernameExistsException') {
        setUserAlreadyExist(true);
      } else {
        setUserAlreadyExist(false);
      }
      return false;
    });

    if (typeof result === 'boolean') {
      return result;
    } else {
      goToConfirmSignUp();
      return !!result.user;
    }
  }, [userData, goToConfirmSignUp]);

  const onBackStep = useCallback(() => {
    router.replace(
      `/auth/sign-up?email=${encodeURIComponent(userData.username)}&step=${
        SignUpSteps.SIGN_UP
      }`
    );
    setSignUpStep(SignUpSteps.SIGN_UP);
    return null;
  }, [router, userData.username]);

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
                userData={userData}
                setUserData={setUserData}
                onSignUp={onSignUp}
                userAlreadyExist={userAlreadyExist}
              />
            )}
            {signUpStep === SignUpSteps.CONFIRM_SIGN_UP && (
              <ConfirmSignUp email={userData.username} onBack={onBackStep} />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SignUp;
