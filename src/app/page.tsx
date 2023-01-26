'use client';

import { theme } from "@pagopa/mui-italia/dist/theme";
import { HeaderAccount } from "@pagopa/mui-italia";
import { ThemeProvider } from "@emotion/react";

const Home = () => {
  const pagoPALink = {
    title: "Developer Portal",
    label: "PagoPA Developer Portal",
    href: "https://www.pagopa.it/it/",
    ariaLabel: "Naviga dentro il developer portal di PagoPA",
  };
  const onAssistanceClick = () => {};

  return (
      <ThemeProvider theme={theme}>
        <HeaderAccount
            enableLogin={false}
            rootLink={pagoPALink}
            onAssistanceClick={onAssistanceClick}
        />
      </ThemeProvider>
  );
};

export default Home;
