'use client';

import { theme } from "@pagopa/mui-italia/dist/theme";
import { HeaderAccount, RootLinkType } from "@pagopa/mui-italia";
import { ThemeProvider } from "@emotion/react";

const rootLink: RootLinkType = {
  title: "Developer Portal",
  label: "PagoPA Developer Portal",
  href: "https://www.pagopa.it/it/",
  ariaLabel: "Naviga dentro il developer portal di PagoPA",
};

const Home = () => (
  <ThemeProvider theme={ theme }>
    <HeaderAccount
      enableLogin={ false }
      rootLink={ rootLink }
      onAssistanceClick={ () => {} }
    />
  </ThemeProvider>
);

export default Home;
