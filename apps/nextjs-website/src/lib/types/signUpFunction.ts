export type SignUpData = {
  readonly username: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly company?: string;
  readonly role?: string;
};

export type SignUpFunction = (data: SignUpData) => Promise<boolean>;
