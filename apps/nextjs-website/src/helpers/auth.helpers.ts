export const passwordMatcher =
  /(?=(.*[0-9]))(?=.*[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;

export const emailMatcher = /^[\w-\\.\\+]+@([\w-]+\.)+[\w-]{2,4}$/;
