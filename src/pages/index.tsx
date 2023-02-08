import { InferGetStaticPropsType } from "next";
import { getCollections } from "@/adapters/gitbook/collections";
import {
  HeaderAccount,
  RootLinkType,
  Showcase,
  theme,
} from "@pagopa/mui-italia";
import { ThemeProvider } from "@emotion/react";

export const getStaticProps = async () => {
  return {
    props: {
      collections: await getCollections(),
    },
  };
};

const pagoPALink: RootLinkType = {
  href: "https://www.pagopa.it/",
  label: "PagoPA Dev Portal",
  title: "PagoPA Dev Portal",
  ariaLabel: "PagoPA Dev Portal",
};

const Home = ({
  collections,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <HeaderAccount
          enableLogin={false}
          rootLink={pagoPALink}
          onAssistanceClick={() => {}}
        />
      </ThemeProvider>

      <Showcase
        items={collections.map((coll) => ({
          title: coll.title,
          subtitle: coll.title,
        }))}
        title="Collections"
      />
    </>
  );
};

export default Home;
