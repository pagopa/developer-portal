export type LoginFunctionParams = {
  readonly username: string;
  readonly password: string;
};

export type LoginFunction = (params: LoginFunctionParams) => Promise<void>;
