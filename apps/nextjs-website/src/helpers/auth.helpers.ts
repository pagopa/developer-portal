import { SignUpUserData } from '@/lib/types/sign-up';

export const passwordMatcher =
  /(?=(.*[0-9]))(?=.*[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;

export const emailMatcher = /^[a-z0-9-._+]+@([a-z0-9-]+\.)+[a-z]{2,4}$/;

export const validateField = (value: string): string | null =>
  !value || value.trim().length === 0 ? 'requiredFieldError' : null;

export const validateEmail = (value: string): string | null => {
  const isNotValid = validateField(value);
  if (isNotValid) {
    return isNotValid;
  }

  return !emailMatcher.test(value) ? 'emailFieldError' : null;
};

export const validatePassword = (value: string): string | null => {
  const isNotValid = validateField(value);
  if (isNotValid) {
    return isNotValid;
  }

  return !passwordMatcher.test(value) ? 'passwordError' : null;
};

export const generateSignUpData = (userData: SignUpUserData) => ({
  username: userData.username,
  password: userData.password,
  attributes: {
    given_name: userData.firstName,
    family_name: userData.lastName,
    'custom:privacy_accepted': 'true',
    'custom:mailinglist_accepted': `${userData.mailinglistAccepted}`,
    'custom:survey_accepted':
      userData.surveyAccepted === true ? 'true' : 'false',
    'custom:job_role': userData.role,
    'custom:company_type': userData.company,
    'custom:preferred_language': userData.preferredLanguage,
  },
});
