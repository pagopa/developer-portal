import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { NextIntlProvider } from "next-intl";
import WebinarHeaderBanner from "../../../nextjs-website/src/components/atoms/WebinarHeaderBanner/WebinarHeaderBanner";

const meta: Meta<typeof WebinarHeaderBanner> = {
  title: "Atoms/WebinarHeaderBanner",
  component: WebinarHeaderBanner,
};

export default meta;

export const Showcase: StoryObj<typeof WebinarHeaderBanner> = {
  args: {
    webinars: [
      {
        title:
          "PagoPA LAB - Approfondiamo la gestione integrata del servizio TARI da pagoPA e IO a SEND",
        description:
          "Come gestire al meglio il servizio TARI attraverso un approccio digitale, integrato e multi-piattaforma a beneficio del Comune e del cittadino.",
        playerSrc: "https://vimeo.com/event/4173771/embed",
        html:
          `<h4 style="font-weight: 600; font-size: 24px;"> Gestione integrata del servizio TARI da pagoPA e IO a  SEND</h4> \n`,
        slug: "PagoPALab-tari",
        isVisibleInHome: true,
        isVisibleInList: true,
        imagePath: "/images/webinar-cover-pagopalab-tari.png",
        speakers: [
          {
            name: "Gloriana Cimmino",
            jobTitle: "Direttore Dipartimento Mercato PA e Imprese",
            avatar: "/images/speaker-cimmino.png",
          },
        ],
        startDateTime: "2024-04-23T08:30:00.000Z",
        endDateTime: "2024-04-23T09:30:00.000Z",
        subscribeCtaLabel: "",
        relatedLinks: {
          title: "Link utili",
          links: [
            {
              text: "I modelli dei servizi più frequenti: Tassa sui rifiuti TARI",
              href: `/app-io/guides/modelli-servizi/casa-e-utenze/tassa-sui-rifiuti-tari`,
            },
          ],
        },
      },
      {
        title: "Esplorando pagoPA: Gestione Posizioni Debitorie",
        description:
          "Esploriamo come è possibile per un ente creditore gestire l'Archivio delle Posizioni Attese usando la Gestione Posizioni Debitorie/Integrazione asincrona in-house di pagoPA",
        playerSrc: "https://vimeo.com/event/4203954/embed",
        html:
          `<h4 style="font-weight: 600; font-size: 24px;"> Gestione Posizioni Debitorie e Integrazione asincrona</h4> \n`,
        slug: "DevTalk-pagoPA-gpd",
        isVisibleInHome: true,
        isVisibleInList: true,
        imagePath: "/images/webinar-cover-pagoPA-gpd.png",
        speakers: [
          {
            name: "Andrea Ferracci",
            jobTitle: "Technical Project Manager - pagoPA Core",
            avatar: "/images/speaker-ferracci.png",
          },
        ],
        startDateTime: "2024-04-12T09:00:00.000Z",
        endDateTime: "2024-04-12T10:00:00.000Z",
        subscribeCtaLabel: "",
        relatedLinks: {
          title: "Link utili",
          links: [
            {
              text: "SANP - Posizioni Debitorie",
              href: `/pago-pa/guides/sanp/appendici/posizioni-debitorie/`,
            },
          ],
        },
      },
    ],
  },
  render: (props) => (
    <NextIntlProvider messages={{}} locale="it">
      <WebinarHeaderBanner {...props} />
    </NextIntlProvider>
  ),
};
