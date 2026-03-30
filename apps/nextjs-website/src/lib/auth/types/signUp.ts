export type SignUpUserData = {
  readonly username: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly company: string;
  readonly preferredLanguage: string;
  readonly role: string;
  readonly mailinglistAccepted: boolean;
  readonly surveyAccepted: boolean;
};
