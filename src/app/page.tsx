'use client';

import { use } from 'react';
import { theme } from "@pagopa/mui-italia/dist/theme";
import { HeaderAccount, RootLinkType } from "@pagopa/mui-italia";
import { ThemeProvider } from "@emotion/react";
import Products from "@/components/Products";
import { getCollections } from "@/app/gitbook/collections";

const rootLink: RootLinkType = {
  title: "Developer Portal",
  label: "PagoPA Developer Portal",
  href: "https://www.pagopa.it/it/",
  ariaLabel: "Naviga dentro il developer portal di PagoPA",
};

const Home = () => {
    const list = use(getCollections());
    return (
        <>
            <ThemeProvider theme={ theme }>
                <HeaderAccount
                    enableLogin={ false }
                    rootLink={ rootLink }
                    onAssistanceClick={ () => {} }
                />
            </ThemeProvider>
            <Products list={ list.items } />
        </>
    );
}

export default Home;
