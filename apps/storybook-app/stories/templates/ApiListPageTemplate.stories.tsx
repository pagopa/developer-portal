import { Meta, StoryObj } from "@storybook/react";
import ApiListPageTemplate from '../../../nextjs-website/src/components/templates/ApiListPageTemplate/ApiListPageTemplate';
import { nextIntlContextDecorator } from "../next-intl-context.helper";
import { title } from "gitbook-docs/markdoc/schema/title";

const meta: Meta<typeof ApiListPageTemplate> = {
    title: 'Templates/ApiListPageTemplate',
    component: ApiListPageTemplate,
  };
  
export default meta;

export const Showcase: StoryObj<typeof ApiListPageTemplate> = {
    decorators: [nextIntlContextDecorator],
    args: {
        breadcrumbs: {
            product: {
                name: 'Piattaforma pagoPA',
                description: 'Il portale per gli sviluppatori di PagoPA',
                slug: 'pagopa',
                logo: {
                  url: 'https://cdn.dev.developer.pagopa.it/app_Io_d9bffd556b.svg',
                },
                subpaths: {
                    overview: {
                        name: "",
                        path: "",
                    }
                }
              },
            path: "PagoPA",
            paths: [
                {
                    name: "API",
                    path: "API",
                }
            ]
        },
        hero: {
        title: "API",
        subtitle:
          "Se vuoi sapere come iscriverti a un e-service partendo dal catalogo e ottenere un voucher per la fruizione del sevizio.",
      },
      cards: [
        {
            title: "asd",
            text: "asd",
            icon: 'asd',
            tags: [
                {
                    label: "yooo",
                },
            ],},{
                title: "asd",
                text: "asd",
                icon: 'asd',
                tags: [
                    {
                        label: "yooo",
                    },
                ],},{
                    title: "asd",
                    text: "asd",
                    icon: 'asd',
                    tags: [
                        {
                            label: "yooo",
                        },
                    ],},{
                        title: "asd",
                        text: "asd",
                        icon: 'asd',
                        tags: [
                            {
                                label: "yooo",
                            },
                        ],}
      ],
    },
  };
  