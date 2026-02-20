import { Meta, StoryObj } from '@storybook/nextjs';
import SolutionTemplate from '../../../nextjs-website/src/components/templates/SolutionTemplate/SolutionTemplate';
import { authProviderDecorator } from '../auth-provider.helper';
import { mockTextBlock } from '../mock-content.helper';
import { productsFixture } from '../fixtures/productsFixture';
import { bannerLinksFixture } from '../fixtures/bannerLinksFixtures';

const meta: Meta<typeof SolutionTemplate> = {
  title: 'Templates/SolutionTemplate',
  component: SolutionTemplate,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

export const Showcase: StoryObj<typeof SolutionTemplate> = {
  args: {
    slug: 'multe-per-violazioni-al-codice-della-strada',
    kickerTitle: 'Soluzioni PagoPA',
    title: 'Multe per violazioni al Codice della Strada',
    description:
      'In questa guida trovi i consigli utili per erogare in maniera virtuosa il servizio di sanzioni per violazione al Codice della strada, con approfondimenti sulla gestione delle diverse fasi.',
    steps: [
      {
        title: '01',
        content: [
          mockTextBlock({
            text: 'Violazione commessa dal cittadino e generazione dell’avviso pagoPA',
          }),
        ],
        products: [productsFixture[1]],
      },
      {
        title: '02',
        content: [
          mockTextBlock({
            text: 'Emissione e pagamento del preavviso di accertamento',
          }),
        ],
        products: [productsFixture[0], productsFixture[2]],
      },
      {
        title: '03',
        content: [
          mockTextBlock({
            text: 'Emissione, consegna e pagamento del verbale di contestazione',
          }),
        ],
        products: productsFixture,
      },
    ],
    dirName: 'DFDSFDFDFSDF',
    landingUseCaseFile: 'SUMMARY.md',
    bannerLinks: bannerLinksFixture,
    stats: [
      {
        title: '+50%',
        description: 'dei verbali viene pagato entro 5 giorni',
      },
      {
        title: '15%',
        description: 'dei quali vengono pagati entro 1 giorno',
      },
      {
        title: '2 mesi',
        description: 'di riduzione effettiva dei tempi di incasso',
      },
    ],
    products: productsFixture,
    webinars: [
      {
        title: 'Test Webinar',
        description: 'Questo è un webinar di test',
        playerSrc: 'https://vimeo.com/event/4135276/embed',
        html:
          `<h4 style="font-weight: 600; font-size: 24px;">Test Webinar</h4>\n` +
          `<p>Questo è un webinar di test</p>\n` +
          `<br />\n` +
          `<br />\n` +
          `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce auctor enim vel sem fringilla, vitae malesuada nisi malesuada. Sed euismod augue id mauris aliquam, at dapibus lectus laoreet. Sed vel nulla vel risus gravida malesuada ac id tortor. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, risus eget bibendum bibendum, quam nisi aliquam nisi, id congue lorem risus id nisi. Sed euismod, risus eget bibendum bibendum, quam nisi aliquam nisi, id congue lorem risus id nisi. Sed euismod, risus eget bibendum bibendum, quam nisi aliquam nisi, id congue lorem risus id nisi.</p>\n`,
        slug: 'test-2024-03-14',
        isVisibleInList: false,
        imagePath: 'https://dev.developer.pagopa.it/images/webinars.png',
        speakers: [
          {
            name: 'Andrea Ferracci',
            jobTitle: 'Technical Project Manager - pagoPA Core',
          },
          {
            name: 'Pasquale Spica',
            jobTitle: 'Software Engineer - pagoPA Core',
          },
        ],
        startDateTime: '2024-03-14T08:30:00.000Z',
        endDateTime: '2024-03-14T09:30:00.000Z',
        subscribeCtaLabel: '',
      },
    ],
  },
  decorators: [authProviderDecorator],
};
