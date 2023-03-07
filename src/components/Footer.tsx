import {
  CompanyLinkType,
  Footer as MUItaliaFooter,
  FooterLinksType,
  PreLoginFooterLinksType,
} from '@pagopa/mui-italia/dist/components/Footer/Footer';

/**
 * This is just an example of the Footer component.
 * A lot of elements should not be hardcoded, but fetched from somewhere else.
 * Take a look at this discussion: https://github.com/pagopa/engineering/discussions/14
 */
const postLoginLinks: Array<FooterLinksType> = [
  {
    label: 'Informativa Privacy',
    href: '#informativa-privacy',
    ariaLabel: 'Vai al link: Informativa Privacy',
    linkType: 'internal',
  },
];

export const pagoPALink: CompanyLinkType = {
  href: 'https://www.pagopa.it/',
  ariaLabel: 'Link: vai al sito di PagoPA S.p.A.',
};

const companyLegalInfo = <>PagoPA S.p.A., Piazza Colonna 370, Roma, 00187 IT</>;

const preLoginLinks: PreLoginFooterLinksType = {
  // First column
  aboutUs: {
    title: undefined,
    links: [
      {
        label: 'Chi siamo',
        href: '#chi-siamo',
        ariaLabel: 'Vai al link: Chi siamo',
        linkType: 'internal',
      },
    ],
  },
  // Third column
  resources: {
    title: 'Risorse',
    links: [
      {
        label: 'Informativa Privacy',
        href: '#informativa-privacy',
        ariaLabel: 'Vai al link: Informativa Privacy',
        linkType: 'internal',
      },
    ],
  },
  // Fourth column
  followUs: {
    title: 'Seguici su',
    socialLinks: [
      {
        icon: 'medium',
        title: 'Medium',
        href: 'https://medium.com/pagopa',
        ariaLabel: 'Link: vai al sito Medium di PagoPA S.p.A.',
      },
    ],
    links: [
      {
        label: 'Accessibilità',
        href: '#accessibilità',
        ariaLabel: 'Vai al link: Accessibilità',
        linkType: 'internal',
      },
    ],
  },
};

const LANGUAGES = {
  it: {
    it: 'Italiano',
    en: 'Inglese',
  },
  en: {
    it: 'Italian',
    en: 'English',
  },
};

// Here we are defining the Footer used in the Developer Portal.
// Simplest solution here is to choose the Footer component from the MUIItalia library
const Footer = () => (
  <MUItaliaFooter
    loggedUser={false}
    companyLink={pagoPALink}
    legalInfo={companyLegalInfo}
    postLoginLinks={postLoginLinks}
    preLoginLinks={preLoginLinks}
    currentLangCode={'it'}
    onLanguageChanged={(newLang) => {
      console.log(`Language changed to ${newLang}`);
    }}
    languages={LANGUAGES}
  />
);

export default Footer;
