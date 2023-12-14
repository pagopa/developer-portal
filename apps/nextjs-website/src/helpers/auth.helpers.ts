export const passwordMatcher =
  /(?=(.*[0-9]))(?=.*[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;

export const emailMatcher = /^[\w-\\.\\+]+@([\w-]+\.)+[\w-]{2,4}$/;

export const validateField = (value: string): string | null =>
  !value || value.trim().length === 0 ? 'requiredFieldError' : null;

export const validateEmail = (value: string): string | null => {
  return validateField(value) || !emailMatcher.test(value)
    ? 'emailFieldError'
    : null;
};

export const validatePassword = (value: string): string | null => {
  return validateField(value) || !passwordMatcher.test(value)
    ? 'passwordError'
    : null;
};
