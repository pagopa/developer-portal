'use client';
import { translations } from '@/_contents/translations';
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
import { useCallback, useState } from 'react';
import { SignUpUserData } from '@/lib/types/sign-up';
import { LoaderPhase } from '@/lib/types/loader';
import { RESET_AFTER_MS } from '@/lib/constants';

interface Info {
  message: string;
  isError: boolean;
}

const SignUp = () => {
  const {
    auth: { signUp },
  } = translations;
  const params = useSearchParams();
  const router = useRouter();
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');

  const [userData, setUserData] = useState<SignUpUserData>({
    username: params.get('email') || '',
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
  const [loader, setLoader] = useState<LoaderPhase | undefined>(undefined);

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
      setInfo({ message: error.message, isError: true });
      return false;
    });

    if (typeof result === 'boolean') {
      return result;
    } else {
      router.replace(
        `/auth/sign-up?email=${userData.username}&step=${SignUpSteps.CONFIRM_SIGN_UP}`
      );
      setSignUpStep(SignUpSteps.CONFIRM_SIGN_UP);
      return !!result.user;
    }
  }, [userData, router]);

  const onBackStep = useCallback(() => {
    router.replace(
      `/auth/sign-up?email=${userData.username}&step=${SignUpSteps.SIGN_UP}`
    );
    setSignUpStep(SignUpSteps.SIGN_UP);
    return null;
  }, [router, userData.username]);

  const onResendEmail = useCallback(async () => {
    setLoader(LoaderPhase.LOADING);

    const result = await Auth.resendSignUp(userData.username).catch(() => {
      setLoader(LoaderPhase.ERROR);
      return false;
    });

    if (result) {
      setLoader(LoaderPhase.SUCCESS);
    }

    setTimeout(() => {
      setLoader(undefined);
    }, RESET_AFTER_MS);
  }, [userData.username]);

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
                  title={advantage.title}
                  description={advantage.text}
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
              <ConfirmSignUp
                email={userData.username}
                onBack={onBackStep}
                onResendEmail={onResendEmail}
                resendLoader={loader}
              />
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
