import { Footer } from '@pagopa/pagopa-editorial-components';
import React from 'react';

type SiteFooterProps = {
  readonly title?: string;
};

const SiteFooter = ({ title }: SiteFooterProps) => {
  return (
    <Footer
      onLanguageChanged={() => null}
      currentLangCode='it'
      languages={{
        it: {
          it: 'Italiano',
        },
      }}
      companyLink={{
        ariaLabel: 'Link: vai al sito di PagoPA S.p.A.',
        href: 'https://www.pagopa.it/',
      }}
      legalInfo={
        <>
          <strong>PagoPA S.p.A.</strong> — società per azioni con socio unico -
          capitale sociale di euro 1,000,000 interamente versato - sede legale
          in Roma, Piazza Colonna 370,
          <br />
          CAP 00187 - n. di iscrizione a Registro Imprese di Roma, CF e P.IVA
          15376371009
        </>
      }
      links={{
        aboutUs: {
          links: [
            {
              ariaLabel: 'Vai al link: Chi siamo',
              href: '#chi-siamo',
              label: 'Chi siamo',
              linkType: 'internal',
            },
            {
              ariaLabel: 'Vai al link: PNRR',
              href: '#pnrr',
              label: 'PNRR',
              linkType: 'internal',
            },
            {
              ariaLabel: 'Vai al link: Media',
              href: '#media',
              label: 'Media',
              linkType: 'internal',
            },
            {
              ariaLabel: 'Vai al link: Lavora con noi',
              href: '#lavora-con-noi',
              label: 'Lavora con noi',
              linkType: 'internal',
            },
          ],
          title: 'test',
        },
        followUs: {
          links: [
            {
              ariaLabel: 'Vai al link: Accessibilità',
              href: '#accessibilità',
              label: 'Accessibilità',
              linkType: 'internal',
            },
          ],
          socialLinks: [
            {
              title: 'Link: vai al sito LinkedIn di PagoPA S.p.A.',
              ariaLabel: 'Link: vai al sito LinkedIn di PagoPA S.p.A.',
              href: 'https://www.linkedin.com/company/pagopa/',
              icon: 'LinkedIn',
            },
            {
              title: 'Link: vai al sito Twitter di PagoPA S.p.A.',
              ariaLabel: 'Link: vai al sito Twitter di PagoPA S.p.A.',
              href: 'https://twitter.com/pagopa',
              icon: 'Twitter',
            },
            {
              title: 'Link: vai al sito Instagram di PagoPA S.p.A.',
              ariaLabel: 'Link: vai al sito Instagram di PagoPA S.p.A.',
              href: 'https://www.instagram.com/pagopa/',
              icon: 'Instagram',
            },
          ],
          title: 'Seguici su',
        },
        resources: {
          links: [
            {
              ariaLabel: 'Vai al link: Informativa Privacy',
              href: '#informativa-privacy',
              label: 'Informativa Privacy',
              linkType: 'internal',
            },
            {
              ariaLabel: 'Vai al link: Certificazioni',
              href: '#certificazioni',
              label: 'Certificazioni',
              linkType: 'internal',
            },
            {
              ariaLabel: 'Vai al link: Sicurezza delle informazioni',
              href: '#sicurezza-delle-informazioni',
              label: 'Sicurezza delle informazioni',
              linkType: 'internal',
            },
            {
              ariaLabel:
                'Vai al link: Diritto alla protezione dei dati personali',
              label: 'Diritto alla protezione dei dati personali',
              linkType: 'internal',
            },
            {
              ariaLabel: 'Vai al link: Preferenze Cookie',
              href: '#preferenze-cookie',
              label: 'Preferenze Cookie',
              linkType: 'internal',
            },
            {
              ariaLabel: 'Vai al link: Termini e Condizioni',
              href: '#terms-conditions',
              label: 'Termini e Condizioni',
              linkType: 'internal',
            },
            {
              ariaLabel: 'Vai al link: Società trasparente',
              href: '#societa-trasparente',
              label: 'Società trasparente',
              linkType: 'internal',
            },
            {
              ariaLabel: 'Vai al link: Responsible Disclosure Policy',
              href: '#responsible-disclosure-policy',
              label: 'Responsible Disclosure Policy',
              linkType: 'internal',
            },
            {
              ariaLabel: 'Vai al link: Modello 321',
              href: '#modello-321',
              label: 'Modello 321',
              linkType: 'internal',
            },
          ],
          title: 'Risorse',
        },
      }}
      showFundedByNextGenerationEULogo={true}
    />
  );
};

export default SiteFooter;
