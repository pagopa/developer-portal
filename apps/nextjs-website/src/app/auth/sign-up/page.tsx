'use client';
import CheckItem from '@/components/molecules/CheckItem/CheckItem';
import ConfirmSignUp from '@/components/organisms/Auth/ConfirmSignUp';
import SignUpForm from '@/components/organisms/Auth/SignUpForm';
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
import { useCallback, useMemo, useState } from 'react';
import { SignUpUserData } from '@/lib/types/sign-up';
import { RESET_AFTER_MS } from '@/config';
import { useTranslations } from 'next-intl';

interface Info {
  message: string;
  isError: boolean;
}

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

  const [info, setInfo] = useState<Info | null>(null);

  const goToConfirmSignUp = useCallback(() => {
    router.replace(
      `/auth/sign-up?email=${encodeURIComponent(userData.username)}&step=${
        SignUpSteps.CONFIRM_SIGN_UP
      }`
    );
    setSignUpStep(SignUpSteps.CONFIRM_SIGN_UP);
  }, [router, userData.username]);

  const onSignUp = useCallback(async () => {
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
      if (error.code.includes('UsernameExistsException')) {
        goToConfirmSignUp();
        return true;
      }
      setInfo({ message: error.message, isError: true });
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

  const advantages = useMemo(
    () => ['exclusive_contents', 'product_updates', 'api_keys', 'support'],
    []
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
            {advantages.map((advantage, index) => {
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
              />
            )}
            {signUpStep === SignUpSteps.CONFIRM_SIGN_UP && (
              <ConfirmSignUp email={userData.username} onBack={onBackStep} />
            )}
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={!!info}
        autoHideDuration={RESET_AFTER_MS}
        onClose={() => setInfo(null)}
      >
        <Alert severity={info?.isError ? 'error' : 'success'}>
          {info?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SignUp;
