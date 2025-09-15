"use client";

import { Amplify } from "aws-amplify";

import { amplifyConfig } from "@/config";
import { Authenticator } from "@aws-amplify/ui-react";
import { FC, PropsWithChildren } from "react";

Amplify.configure(amplifyConfig);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
};

export default AuthProvider;
